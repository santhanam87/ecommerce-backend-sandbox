export const PERMISSION_KEYS = {
  USER: "user",
  USER_ROLE: "user-role",
} as const;

export const PERMISSION_SCOPES = {
  CREATE: "create",
  UPDATE: "update",
} as const;

export const PERMISSION_SCOPE_BY_KEY = {
  [PERMISSION_KEYS.USER]: {
    CREATE: PERMISSION_SCOPES.CREATE,
    UPDATE: PERMISSION_SCOPES.UPDATE,
  },
  [PERMISSION_KEYS.USER_ROLE]: {
    CREATE: PERMISSION_SCOPES.CREATE,
  },
} as const;
