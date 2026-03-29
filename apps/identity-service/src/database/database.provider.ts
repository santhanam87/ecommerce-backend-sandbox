import { ConfigModule, ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";
import { RolePermission } from "src/auth/role-permission/entities/role-permission.entity";
import { Role } from "src/auth/role/entities/role.entity";
import { Tenant } from "src/auth/tenant/entities/tenant.entity";
import { User } from "src/auth/user/entities/user.entity";
import { UserRole } from "src/auth/user-role/entities/user-role.entity";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        models: [Tenant, User, Role, RolePermission, UserRole],
      });
      await sequelize.sync();
      console.info("Identity service database connected successfully");
      return sequelize;
    },
  },
];
