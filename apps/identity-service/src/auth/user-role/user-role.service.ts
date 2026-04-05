import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Op } from "sequelize";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { USER_ROLE_ERROR_MESSAGES } from "./user-role.constants";
import { UserRole } from "./entities/user-role.entity";
import { Role } from "../role/entities/role.entity";
import { User } from "../user/entities/user.entity";

@Injectable()
export class UserRoleService {
  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    const sequelize = UserRole.sequelize;

    if (!sequelize) {
      throw new Error(
        USER_ROLE_ERROR_MESSAGES.DATABASE_CONNECTION_NOT_INITIALIZED,
      );
    }

    const userRole = await sequelize.transaction(async (transaction) => {
      const existingActiveRole = await UserRole.findOne({
        where: {
          user_id: createUserRoleDto.user_id,
          is_active_role: true,
        },
        transaction,
      });

      return UserRole.create<UserRole>(
        {
          ...(createUserRoleDto as any),
          is_active_role: !existingActiveRole,
        },
        { transaction },
      );
    });

    return UserRole.findByPk<UserRole>(userRole.id, {
      include: [User, Role],
      rejectOnEmpty: true,
    });
  }

  async findAll(): Promise<UserRole[]> {
    return UserRole.findAll<UserRole>({
      include: [User, Role],
    });
  }

  async setActiveRole(id: string, actorUserId: string): Promise<UserRole> {
    const sequelize = UserRole.sequelize;

    if (!sequelize) {
      throw new Error(
        USER_ROLE_ERROR_MESSAGES.DATABASE_CONNECTION_NOT_INITIALIZED,
      );
    }

    const activeUserRole = await sequelize.transaction(async (transaction) => {
      const currentUserRole = await UserRole.findByPk<UserRole>(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!currentUserRole) {
        throw new NotFoundException(
          USER_ROLE_ERROR_MESSAGES.USER_ROLE_NOT_FOUND,
        );
      }

      if (currentUserRole.user_id !== actorUserId) {
        throw new ForbiddenException(
          USER_ROLE_ERROR_MESSAGES.CANNOT_UPDATE_OTHER_USER_ACTIVE_ROLE,
        );
      }

      await UserRole.update(
        { is_active_role: false },
        {
          where: {
            user_id: currentUserRole.user_id,
            is_active_role: true,
            id: { [Op.ne]: currentUserRole.id },
          },
          transaction,
        },
      );

      if (!currentUserRole.is_active_role) {
        await currentUserRole.update({ is_active_role: true }, { transaction });
      }

      return currentUserRole;
    });

    return UserRole.findByPk<UserRole>(activeUserRole.id, {
      include: [User, Role],
      rejectOnEmpty: true,
    });
  }
}
