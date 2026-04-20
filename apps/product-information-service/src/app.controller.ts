import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt.auth-guard';
import { PermissionGuard } from './auth/permission.guard';
import { CheckPermission } from './common/decorator/check-permission.decorator';
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from './common/constants/permission.constants';
import { AppService } from './app.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.APP,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.APP].READ,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
