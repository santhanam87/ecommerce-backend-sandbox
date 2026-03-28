import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TenantService } from "./tenant/tenant.service";
import { TenantController } from "./tenant/tenant.controller";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";

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
  controllers: [TenantController, UserController],
  providers: [
    {
      provide: "JwtStrategy",
      useFactory: (config: ConfigService) => {
        const secret = config.get("JWT_SECRET") as string;
        return new JwtStrategy(secret);
      },
      inject: [ConfigService],
    },
    TenantService,
    UserService,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
