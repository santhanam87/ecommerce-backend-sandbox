import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/role.entity";

@Injectable()
export class RoleService {
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return Role.create<Role>(createRoleDto as any);
  }

  async findAll(): Promise<Role[]> {
    return Role.findAll<Role>();
  }
}
