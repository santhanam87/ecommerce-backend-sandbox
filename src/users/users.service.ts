import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PasswordUtil } from 'src/common/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  private users: User[] = [];
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
    const users = await this.prisma.user.findMany();
    return users.map((user: User) => new UserResponseDto(user));
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  public async deleteUserById(id: string): Promise<boolean> {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    return deletedUser !== null;
  }

  public async updateUser(
    id: string,
    updatedData: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    if (updatedData.password) {
      updatedData.password = PasswordUtil.hashPassword(updatedData.password);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
    if (updatedUser) {
      return new UserResponseDto(updatedUser);
    }
    return null;
  }
}
