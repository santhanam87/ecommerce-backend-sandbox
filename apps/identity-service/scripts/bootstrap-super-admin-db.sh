#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_NAME="${DB_NAME:-identity-service}"

TENANT_NAME="${TENANT_NAME:-Acme Super Tenant}"
SUBSCRIPTION_TYPE="${SUBSCRIPTION_TYPE:-enterprise}"
SUPER_ADMIN_EMAIL="${SUPER_ADMIN_EMAIL:-super.admin@acme.com}"
SUPER_ADMIN_PASSWORD="${SUPER_ADMIN_PASSWORD:-SuperSecure123!}"
SUPER_ADMIN_ROLE_NAME="${SUPER_ADMIN_ROLE_NAME:-super-admin}"

PERMISSION_KEYS=(
  "user"
  "user-role"
  "tenant"
  "role"
  "role-permission"
  "pim.app"
  "pim.category"
  "pim.category-rule-group"
  "pim.category-rule-condition"
  "pim.product"
  "pim.product-variant"
  "pim.product-attribute-key"
  "pim.product-attribute-value"
  "pim.product-attribute-key-value-mapping"
  "pim.product-property-key"
  "pim.product-property-value"
  "pim.product-property-key-value-mapping"
)

log_step() {
  echo
  echo "[bootstrap-db] $1"
}

sql_escape() {
  printf "%s" "$1" | sed "s/'/''/g"
}

generate_uuid() {
  node -e "console.log(require('crypto').randomUUID())"
}

psql_exec() {
  local sql="$1"
  PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -v ON_ERROR_STOP=1 \
    -c "$sql" >/dev/null
}

psql_query() {
  local sql="$1"
  PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -v ON_ERROR_STOP=1 \
    -tA \
    -c "$sql" | tr -d '[:space:]'
}

TENANT_NAME_ESCAPED="$(sql_escape "$TENANT_NAME")"
SUBSCRIPTION_TYPE_ESCAPED="$(sql_escape "$SUBSCRIPTION_TYPE")"
SUPER_ADMIN_EMAIL_ESCAPED="$(sql_escape "$SUPER_ADMIN_EMAIL")"
SUPER_ADMIN_ROLE_NAME_ESCAPED="$(sql_escape "$SUPER_ADMIN_ROLE_NAME")"
PASSWORD_HASH="$(PASSWORD_TO_HASH="$SUPER_ADMIN_PASSWORD" node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync(process.env.PASSWORD_TO_HASH, 10));")"
PASSWORD_HASH_ESCAPED="$(sql_escape "$PASSWORD_HASH")"

log_step "Ensuring tenant exists"
TENANT_ID="$(psql_query "SELECT id FROM tenants WHERE \"tenantName\" = '$TENANT_NAME_ESCAPED' LIMIT 1;")"
if [[ -z "$TENANT_ID" ]]; then
  TENANT_ID="$(generate_uuid)"
  psql_exec "
    INSERT INTO tenants (id, \"tenantName\", \"subscriptionType\", status, \"createdAt\", \"updatedAt\")
    VALUES ('$TENANT_ID', '$TENANT_NAME_ESCAPED', '$SUBSCRIPTION_TYPE_ESCAPED', 'active', NOW(), NOW());
  "
  echo "[bootstrap-db] Created tenant: $TENANT_ID"
else
  psql_exec "
    UPDATE tenants
    SET \"subscriptionType\" = '$SUBSCRIPTION_TYPE_ESCAPED', \"updatedAt\" = NOW()
    WHERE id = '$TENANT_ID';
  "
  echo "[bootstrap-db] Reused tenant: $TENANT_ID"
fi

log_step "Ensuring super-admin user exists"
USER_ID="$(psql_query "SELECT id FROM users WHERE email = '$SUPER_ADMIN_EMAIL_ESCAPED' LIMIT 1;")"
if [[ -z "$USER_ID" ]]; then
  USER_ID="$(generate_uuid)"
  psql_exec "
    INSERT INTO users (id, tenant_id, email, password, is_active, \"createdAt\", \"updatedAt\")
    VALUES ('$USER_ID', '$TENANT_ID', '$SUPER_ADMIN_EMAIL_ESCAPED', '$PASSWORD_HASH_ESCAPED', true, NOW(), NOW());
  "
  echo "[bootstrap-db] Created user: $USER_ID"
else
  USER_TENANT_ID="$(psql_query "SELECT tenant_id FROM users WHERE id = '$USER_ID' LIMIT 1;")"
  if [[ "$USER_TENANT_ID" != "$TENANT_ID" ]]; then
    echo "[bootstrap-db] Error: user '$SUPER_ADMIN_EMAIL' belongs to tenant '$USER_TENANT_ID' (expected '$TENANT_ID')." >&2
    exit 1
  fi

  psql_exec "
    UPDATE users
    SET password = '$PASSWORD_HASH_ESCAPED', is_active = true, \"updatedAt\" = NOW()
    WHERE id = '$USER_ID';
  "
  echo "[bootstrap-db] Reused user: $USER_ID"
fi

log_step "Ensuring super-admin role exists"
ROLE_ID="$(psql_query "SELECT id FROM roles WHERE tenant_id = '$TENANT_ID' AND name = '$SUPER_ADMIN_ROLE_NAME_ESCAPED' LIMIT 1;")"
if [[ -z "$ROLE_ID" ]]; then
  ROLE_ID="$(generate_uuid)"
  psql_exec "
    INSERT INTO roles (id, tenant_id, name, \"createdAt\", \"updatedAt\")
    VALUES ('$ROLE_ID', '$TENANT_ID', '$SUPER_ADMIN_ROLE_NAME_ESCAPED', NOW(), NOW());
  "
  echo "[bootstrap-db] Created role: $ROLE_ID"
else
  echo "[bootstrap-db] Reused role: $ROLE_ID"
fi

log_step "Ensuring full Identity + PIM permissions"
for permission_key in "${PERMISSION_KEYS[@]}"; do
  permission_key_escaped="$(sql_escape "$permission_key")"
  role_permission_id="$(psql_query "SELECT id FROM role_permissions WHERE role_id = '$ROLE_ID' AND permission = '$permission_key_escaped' ORDER BY \"createdAt\" ASC LIMIT 1;")"

  if [[ -z "$role_permission_id" ]]; then
    role_permission_id="$(generate_uuid)"
    psql_exec "
      INSERT INTO role_permissions (id, role_id, permission, value, \"createdAt\", \"updatedAt\")
      VALUES (
        '$role_permission_id',
        '$ROLE_ID',
        '$permission_key_escaped',
        '{\"allow\":true,\"scope\":[\"create\",\"read\",\"update\",\"delete\"]}',
        NOW(),
        NOW()
      );
    "
  else
    psql_exec "
      UPDATE role_permissions
      SET value = '{\"allow\":true,\"scope\":[\"create\",\"read\",\"update\",\"delete\"]}', \"updatedAt\" = NOW()
      WHERE id = '$role_permission_id';
    "
  fi
done

log_step "Ensuring user-role mapping and active role"
USER_ROLE_ID="$(psql_query "SELECT id FROM user_roles WHERE user_id = '$USER_ID' AND role_id = '$ROLE_ID' ORDER BY \"createdAt\" ASC LIMIT 1;")"
if [[ -z "$USER_ROLE_ID" ]]; then
  USER_ROLE_ID="$(generate_uuid)"
  psql_exec "
    INSERT INTO user_roles (id, user_id, role_id, is_active_role, \"createdAt\", \"updatedAt\")
    VALUES ('$USER_ROLE_ID', '$USER_ID', '$ROLE_ID', true, NOW(), NOW());
  "
fi

psql_exec "
  UPDATE user_roles
  SET is_active_role = CASE WHEN id = '$USER_ROLE_ID' THEN true ELSE false END,
      \"updatedAt\" = NOW()
  WHERE user_id = '$USER_ID';
"

log_step "Bootstrap complete"
echo "[bootstrap-db] tenant_id=$TENANT_ID"
echo "[bootstrap-db] user_id=$USER_ID"
echo "[bootstrap-db] role_id=$ROLE_ID"
echo "[bootstrap-db] user_role_id=$USER_ROLE_ID"
echo "[bootstrap-db] email=$SUPER_ADMIN_EMAIL"
echo "[bootstrap-db] password=$SUPER_ADMIN_PASSWORD"
