import { Role } from "../role/entities/role.entity";
import { RolePermission } from "../role-permission/entities/role-permission.entity";
import { User } from "../user/entities/user.entity";

export type AccessTokenPermission = {
  key: RolePermission["permission"];
  value: RolePermission["value"];
};

export type AccessTokenRole = Pick<Role, "id" | "name"> & {
  permissions: AccessTokenPermission[];
};

export type AccessTokenPayload = Pick<
  User,
  "id" | "email" | "tenant_id" | "is_active"
>;

export type RefreshTokenPayload = {
  sub: User["id"];
  type: "refresh";
};
