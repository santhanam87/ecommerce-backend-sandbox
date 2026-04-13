import { ConflictException, Injectable } from "@nestjs/common";
import { UniqueConstraintError } from "sequelize";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/role.entity";
import { ROLE_ERROR_MESSAGES } from "./role.constants";

@Injectable()
export class RoleService {
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await Role.findOne({
      where: { name: createRoleDto.name, tenant_id: createRoleDto.tenant_id },
    });
    if (existingRole) {
      throw new ConflictException(ROLE_ERROR_MESSAGES.ROLE_NAME_ALREADY_EXISTS);
    }
    try {
      return await Role.create<Role>(createRoleDto as any);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException(
          ROLE_ERROR_MESSAGES.ROLE_NAME_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Role[]> {
    return Role.findAll<Role>();
  }
}
