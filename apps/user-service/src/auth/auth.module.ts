import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.auth-guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    UsersModule,
  ],
  providers: [
    AuthService,
    {
      provide: 'JwtStrategy',
      useFactory: (config: ConfigService) => {
        const secret = config.get('JWT_SECRET') as string;
        return new JwtStrategy(secret);
      },
      inject: [ConfigService],
    },
    JwtAuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
