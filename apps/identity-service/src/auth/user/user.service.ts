import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";
import { Role } from "../role/entities/role.entity";
import { RolePermission } from "../role-permission/entities/role-permission.entity";
import { UserRole } from "../user-role/entities/user-role.entity";
import { USER_ERROR_MESSAGES } from "./user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await User.findOne<User>({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        USER_ERROR_MESSAGES.USER_EMAIL_ALREADY_EXISTS,
      );
    }

    const password = await bcrypt.hash(createUserDto.password, 10);

    let createdUser: User;

    try {
      createdUser = await User.create<User>({
        ...createUserDto,
        password,
        is_active: true,
      } as any);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException(
          USER_ERROR_MESSAGES.USER_EMAIL_ALREADY_EXISTS,
        );
      }
      throw error;
    }

    return User.findByPk<User>(createdUser.id, {
      rejectOnEmpty: true,
    });
  }

  async findAll(): Promise<User[]> {
    return User.findAll<User>();
  }

  async updateIsActive(id: string, isActive: boolean): Promise<User> {
    const user = await User.findByPk<User>(id);

    if (!user) {
      throw new NotFoundException(USER_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await user.update({ is_active: isActive });
    return User.findByPk<User>(user.id, {
      rejectOnEmpty: true,
    });
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return User.scope("withPassword").findOne<User>({
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
