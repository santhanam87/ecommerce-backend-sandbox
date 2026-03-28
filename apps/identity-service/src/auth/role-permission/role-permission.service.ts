import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRolePermissionDto } from "./dto/create-role-permission.dto";
import { UpdateRolePermissionValueDto } from "./dto/update-role-permission-value.dto";
import { RolePermission } from "./entities/role-permission.entity";

@Injectable()
export class RolePermissionService {
  async create(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    return RolePermission.create<RolePermission>(
      createRolePermissionDto as any,
    );
  }

  async findAll(): Promise<RolePermission[]> {
    return RolePermission.findAll<RolePermission>();
  }

  async updateValue(
    id: string,
    updateRolePermissionValueDto: UpdateRolePermissionValueDto,
  ): Promise<RolePermission> {
    const rolePermission = await RolePermission.findByPk<RolePermission>(id);

    if (!rolePermission) {
      throw new NotFoundException("Role permission not found");
    }

    return rolePermission.update({
      value: updateRolePermissionValueDto.value,
    });
  }
}
