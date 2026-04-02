import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { Role } from "../role/entities/role.entity";
import { RolePermission } from "../role-permission/entities/role-permission.entity";
import { UserRole } from "../user-role/entities/user-role.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(createUserDto.password, 10);

    return User.create<User>({
      ...createUserDto,
      password,
      is_active: true,
    } as any);
  }

  async findAll(): Promise<User[]> {
    return User.findAll<User>();
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return User.findOne<User>({
      where: {
        email,
        is_active: true,
      },
      include: [
        {
          model: UserRole,
          include: [
            {
              model: Role,
              include: [RolePermission],
            },
          ],
        },
      ],
    });
  }

  async findActiveById(id: string): Promise<User | null> {
    return User.findOne<User>({
      where: {
        id,
        is_active: true,
      },
      include: [
        {
          model: UserRole,
          include: [
            {
              model: Role,
              include: [RolePermission],
            },
          ],
        },
      ],
    });
  }
}
