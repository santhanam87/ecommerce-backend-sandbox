import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PasswordUtil } from 'src/common/utils/password.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { type User } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async createUser({
    email,
    password,
    name,
  }: CreateUserDto): Promise<UserResponseDto> {
    const insertedUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: PasswordUtil.hashPassword(password),
        createdAt: new Date(),
      },
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

  public async getUserById(id: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
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
    const user: User | null = await this.prisma.user.findUnique({
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
