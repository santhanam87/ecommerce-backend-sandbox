import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PasswordUtil } from 'src/common/utils/password.util';

@Injectable()
export class UsersService {
  private users: User[] = [];

  public createUser({
    userName,
    email,
    password,
    name,
  }: CreateUserDto): UserResponseDto {
    const user = new User();
    user.id = (this.users.length + 1).toString();
    user.createdAt = new Date();
    user.name = name;
    user.userName = userName;
    user.email = email;
    user.password = PasswordUtil.hashPassword(password);
    this.users.push(user);
    return new UserResponseDto(user);
  }

  public getAllUsers(): UserResponseDto[] {
    return this.users.map((user) => new UserResponseDto(user));
  }

  public getUserById(userName: string): User | undefined {
    return this.users.find((user) => {
      return user.userName === userName;
    });
  }

  public deleteUserById(userName: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.userName !== userName);
    return this.users.length < initialLength;
  }

  public updateUser(
    userName: string,
    updatedData: UpdateUserDto,
  ): UserResponseDto | undefined {
    const user = this.users.find((user) => user.userName === userName);
    if (user) {
      if (updatedData.password) {
        updatedData.password = PasswordUtil.hashPassword(updatedData.password);
      }
      Object.assign(user, updatedData);
      return new UserResponseDto(user);
    }
    return undefined;
  }
}
