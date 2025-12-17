import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PasswordUtil } from 'src/common/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async createUser({
    userName,
    email,
    password,
    name,
  }: CreateUserDto): Promise<UserResponseDto> {
    const user = new User();
    user.createdAt = new Date();
    user.name = name;
    user.userName = userName;
    user.email = email;
    user.password = PasswordUtil.hashPassword(password);
    const insertedUser = await this.prisma.user.create({
      data: user,
    });
    this.eventEmitter.emit('user.created', {
      userId: insertedUser.id,
      email: insertedUser.email,
      userName: insertedUser.userName,
    });
    return new UserResponseDto(insertedUser);
  }

  public async getAllUsers() {
    const users: User[] = await this.prisma.user.findMany();
    return users.map((user: User) => new UserResponseDto(user));
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  public async getUserByName(userName: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { userName },
    });
    return user;
  }

  public async getUserById(id: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  public async deleteUserById(userName: string): Promise<boolean> {
    const deletedUser = await this.prisma.user.delete({
      where: { userName },
    });
    return deletedUser !== null;
  }

  public async updateUser(
    userName: string,
    updatedData: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { userName },
    });
    if (!user) {
      return null;
    }
    if (updatedData.password) {
      updatedData.password = PasswordUtil.hashPassword(updatedData.password);
    }
    const updatedUser = await this.prisma.user.update({
      where: { userName },
      data: updatedData,
    });
    if (updatedUser) {
      return new UserResponseDto(updatedUser);
    }
    return null;
  }
}
