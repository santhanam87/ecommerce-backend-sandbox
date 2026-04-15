import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.auth-guard';
import { PermissionGuard } from './permission.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'JwtStrategy',
      useFactory: (config: ConfigService) => {
        const secret = config.get('JWT_SECRET') as string;
        return new JwtStrategy(secret);
      },
      inject: [ConfigService],
    },
    JwtAuthGuard,
    PermissionGuard,
    PermissionService,
  ],
})
export class AuthModule {}
