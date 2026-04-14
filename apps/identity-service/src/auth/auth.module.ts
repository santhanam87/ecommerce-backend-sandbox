import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PermissionGuard } from "./guards/permission.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TenantService } from "./tenant/tenant.service";
import { TenantController } from "./tenant/tenant.controller";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { RoleService } from "./role/role.service";
import { RoleController } from "./role/role.controller";
import { RolePermissionService } from "./role-permission/role-permission.service";
import { RolePermissionController } from "./role-permission/role-permission.controller";
import { UserRoleService } from "./user-role/user-role.service";
import { UserRoleController } from "./user-role/user-role.controller";
import { RolePermissionCacheService } from "./role-permission/role-permission-cache.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    TenantController,
    UserController,
    RoleController,
    RolePermissionController,
    UserRoleController,
  ],
  providers: [
    JwtStrategy,
    AuthService,
    TenantService,
    UserService,
    RoleService,
    RolePermissionService,
    RolePermissionCacheService,
    UserRoleService,
    JwtAuthGuard,
    PermissionGuard,
  ],
})
export class AuthModule {}
