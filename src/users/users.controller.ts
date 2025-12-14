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
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':userName')
  public getUserById(@Param('userName') id: string) {
    const user = this.usersService.getUserById(id);
    if (user) {
      return new UserResponseDto(user);
    }
    return null;
  }
  @Post()
  public createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':userName')
  public updateUser(
    @Param('userName') userName: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userName, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
