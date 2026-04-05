export const USER_ROLE_ERROR_MESSAGES = {
  DATABASE_CONNECTION_NOT_INITIALIZED: "Database connection is not initialized",
  USER_ROLE_NOT_FOUND: "User role not found",
  CANNOT_CREATE_USER_ROLE_MAPPING:
    "You are not allowed to create user-role mapping",
  CANNOT_UPDATE_OTHER_USER_ACTIVE_ROLE:
    "You can only update your own active role",
  CANNOT_READ_USER_ROLES:
    "Only users with user-role.read permission can read user roles",
} as const;
