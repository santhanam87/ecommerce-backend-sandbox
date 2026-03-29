import { Injectable } from "@nestjs/common";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRole } from "./entities/user-role.entity";
import { Role } from "../role/entities/role.entity";
import { User } from "../user/entities/user.entity";

@Injectable()
export class UserRoleService {
  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    const userRole = await UserRole.create<UserRole>(createUserRoleDto as any);

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
}
