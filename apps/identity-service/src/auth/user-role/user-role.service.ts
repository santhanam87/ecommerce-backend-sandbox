import { Injectable } from "@nestjs/common";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRole } from "./entities/user-role.entity";

@Injectable()
export class UserRoleService {
  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    return UserRole.create<UserRole>(createUserRoleDto as any);
  }

  async findAll(): Promise<UserRole[]> {
    return UserRole.findAll<UserRole>();
  }
}
