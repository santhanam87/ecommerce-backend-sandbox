import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PasswordUtil } from 'src/common/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  private users: User[] = [];
  constructor(private readonly prisma: PrismaService) {}

  public async createUser({
    userName,
    email,
    password,
    name,
  }: CreateUserDto): Promise<UserResponseDto> {
    const user = new User();
    user.id = (this.users.length + 1).toString();
    user.createdAt = new Date();
    user.name = name;
    user.userName = userName;
    user.email = email;
    user.password = PasswordUtil.hashPassword(password);
    const insertedUser = await this.prisma.user.create({
      data: user,
    });
    return new UserResponseDto(insertedUser);
  }

  public async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users.map((user: User) => new UserResponseDto(user));
  }

  public getUserById(userName: string): User | null {
    return (
      (this.users.find((user: User) => {
        return user.userName === userName;
      }) as User) || null
    );
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
