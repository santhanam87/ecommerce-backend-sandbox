import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersNotification } from 'src/notifications/user.notification';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersNotification],
  exports: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
