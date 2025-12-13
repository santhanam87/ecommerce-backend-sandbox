import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtil } from 'src/common/utils/password.util';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtService = jwtService;
    this.usersService = usersService;
  }
  public validateUser(userName: string, pasword: string): any {
    const user = this.usersService.getUserById(userName);
    if (user && PasswordUtil.comparePasswords(pasword, user.password)) {
      return new UserResponseDto(user);
    }
    return null;
  }
  public login(user: LoginDto) {
    if (!this.validateUser(user.userName, user.password)) {
      return { message: 'Invalid credentials' };
    }
    const payload = { userName: user.userName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
