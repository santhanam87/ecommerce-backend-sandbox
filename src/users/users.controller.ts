import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PasswordUtil } from 'src/common/utils/password.util';
import { SignInUserDto } from './dto/singin-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  public getAllUsers(): UserResponseDto[] {
    return this.usersService.getAllUsers();
  }
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
  @Post('/signin')
  public signInUser(@Body() body: SignInUserDto) {
    // Sign in logic to be implemented
    const { userName, password } = body;
    const user = this.usersService.getUserById(userName);
    if (user && PasswordUtil.comparePasswords(password, user.password)) {
      return new UserResponseDto(user);
    }
    return { message: 'Invalid credentials' };
  }
  @Patch(':userName')
  public updateUser(
    @Param('userName') userName: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userName, body);
  }
  @Delete(':id')
  public deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
