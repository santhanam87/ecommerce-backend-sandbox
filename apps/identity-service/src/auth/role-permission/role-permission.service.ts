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

  async findAllByRoleId(roleId: string): Promise<RolePermission[]> {
    const role = await Role.findByPk<Role>(roleId);

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    return RolePermission.findAll<RolePermission>({
      where: { role_id: roleId },
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
      value: {
        allow: true,
        scope: updateRolePermissionValueDto.scope,
      },
    });

    return RolePermission.findByPk<RolePermission>(id, {
      include: [Role],
      rejectOnEmpty: true,
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const rolePermission = await RolePermission.findByPk<RolePermission>(id);

    if (!rolePermission) {
      throw new NotFoundException("Role permission not found");
    }

    await rolePermission.destroy();
    return { message: "Role permission deleted successfully" };
  }
}
