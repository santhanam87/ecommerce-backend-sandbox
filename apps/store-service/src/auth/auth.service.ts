import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordUtil } from 'src/common/utils/password.util';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtService = jwtService;
    this.usersService = usersService;
  }
  public async validateUser(
    userName: string,
    pasword: string,
  ): Promise<User | null> {
    const user = await this.usersService.getUserByName(userName);
    if (user && PasswordUtil.comparePasswords(pasword, user.password)) {
      return user;
    }
    return null;
  }
  public async login({ userName, password }: LoginDto) {
    try {
      const user = await this.validateUser(userName, password);
      if (!user) {
        return { message: 'Invalid credentials' };
      }
      const payload = { id: user.id, sub: user.userName };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      console.info('Error during login:', err);
      return { message: 'Invalid credentials' };
    }
  }
}
