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

  @Get(':userName')
  public async getUserById(@Param('userName') userName: string) {
    const user = await this.usersService.getUserByName(userName);
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

  @Patch(':userName')
  public updateUser(
    @Param('userName') userName: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userName, body);
  }

  @Delete(':userName')
  public deleteUserById(@Param('userName') userName: string) {
    return this.usersService.deleteUserById(userName);
  }
}
