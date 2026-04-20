export const createPermissionKey = (domain: string, feature: string): string =>
  `${domain}.${feature}`;

export const PERMISSION_SCOPES = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

const PERMISSION_DOMAIN = 'pim';

export const PERMISSION_KEYS = {
  APP: createPermissionKey(PERMISSION_DOMAIN, 'app'),
  CATEGORY: createPermissionKey(PERMISSION_DOMAIN, 'category'),
  CATEGORY_RULE_GROUP: createPermissionKey(
    PERMISSION_DOMAIN,
    'category-rule-group',
  ),
  CATEGORY_RULE_CONDITION: createPermissionKey(
    PERMISSION_DOMAIN,
    'category-rule-condition',
  ),
  PRODUCT: createPermissionKey(PERMISSION_DOMAIN, 'product'),
  PRODUCT_VARIANT: createPermissionKey(PERMISSION_DOMAIN, 'product-variant'),
  PRODUCT_ATTRIBUTE_KEY: createPermissionKey(
    PERMISSION_DOMAIN,
    'product-attribute-key',
  ),
  PRODUCT_ATTRIBUTE_VALUE: createPermissionKey(
    PERMISSION_DOMAIN,
    'product-attribute-value',
  ),
  PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING: createPermissionKey(
    PERMISSION_DOMAIN,
    'product-attribute-key-value-mapping',
  ),
  PRODUCT_PROPERTY_KEY: createPermissionKey(
    PERMISSION_DOMAIN,
    'product-property-key',
  ),
  PRODUCT_PROPERTY_VALUE: createPermissionKey(
    PERMISSION_DOMAIN,
    'product-property-value',
  ),
  PRODUCT_PROPERTY_KEY_VALUE_MAPPING: createPermissionKey(
    PERMISSION_DOMAIN,
    'product-property-key-value-mapping',
  ),
} as const;

const CRUD_SCOPES = {
  CREATE: PERMISSION_SCOPES.CREATE,
  READ: PERMISSION_SCOPES.READ,
  UPDATE: PERMISSION_SCOPES.UPDATE,
  DELETE: PERMISSION_SCOPES.DELETE,
} as const;

export const PERMISSION_SCOPE_BY_KEY = {
  [PERMISSION_KEYS.APP]: CRUD_SCOPES,
  [PERMISSION_KEYS.CATEGORY]: CRUD_SCOPES,
  [PERMISSION_KEYS.CATEGORY_RULE_GROUP]: CRUD_SCOPES,
  [PERMISSION_KEYS.CATEGORY_RULE_CONDITION]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_VARIANT]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_PROPERTY_KEY]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE]: CRUD_SCOPES,
  [PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING]: CRUD_SCOPES,
} as const;
