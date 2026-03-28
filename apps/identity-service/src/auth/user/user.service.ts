import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    return User.create<User>(createUserDto as any);
  }

  async findAll(): Promise<User[]> {
    return User.findAll<User>();
  }
}
