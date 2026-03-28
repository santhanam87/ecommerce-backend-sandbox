import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TenantService } from "./tenant/tenant.service";
import { TenantController } from "./tenant/tenant.controller";

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
  controllers: [TenantController],
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
    JwtAuthGuard,
  ],
})
export class AuthModule {}
