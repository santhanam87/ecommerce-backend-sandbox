import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  public async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (user) {
      return new UserResponseDto(user);
    }
    return null;
  }

  @Public()
  @Post()
  public createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  public updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  public deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
