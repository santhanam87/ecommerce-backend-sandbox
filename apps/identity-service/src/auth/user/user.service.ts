import { Injectable, NotFoundException } from "@nestjs/common";
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

    const createdUser = await User.create<User>({
      ...createUserDto,
      password,
      is_active: true,
    } as any);

    return User.findByPk<User>(createdUser.id, {
      attributes: { exclude: ["password"] },
      rejectOnEmpty: true,
    });
  }

  async findAll(): Promise<User[]> {
    return User.findAll<User>({
      attributes: { exclude: ["password"] },
    });
  }

  async updateIsActive(id: string, isActive: boolean): Promise<User> {
    const user = await User.findByPk<User>(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await user.update({ is_active: isActive });
    return User.findByPk<User>(user.id, {
      attributes: { exclude: ["password"] },
      rejectOnEmpty: true,
    });
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
