import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRolePermissionDto } from "./dto/create-role-permission.dto";
import { UpdateRolePermissionValueDto } from "./dto/update-role-permission-value.dto";
import { RolePermission } from "./entities/role-permission.entity";
import { Role } from "../role/entities/role.entity";

@Injectable()
export class RolePermissionService {
  async create(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    const rolePermission = await RolePermission.create<RolePermission>(
      createRolePermissionDto as any,
    );

    return RolePermission.findByPk<RolePermission>(rolePermission.id, {
      include: [Role],
      rejectOnEmpty: true,
    });
  }

  async findAll(): Promise<RolePermission[]> {
    return RolePermission.findAll<RolePermission>({
      include: [Role],
    });
  }

  async updateValue(
    id: string,
    updateRolePermissionValueDto: UpdateRolePermissionValueDto,
  ): Promise<RolePermission> {
    const rolePermission = await RolePermission.findByPk<RolePermission>(id);

    if (!rolePermission) {
      throw new NotFoundException("Role permission not found");
    }

    await rolePermission.update({
      value: updateRolePermissionValueDto.value,
    });

    return RolePermission.findByPk<RolePermission>(id, {
      include: [Role],
      rejectOnEmpty: true,
    });
  }
}
