import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from "src/common/constants/permission.constants";
import { CheckPermission } from "../decorators/check-permission.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionGuard } from "../guards/permission.guard";
import { CreateRolePermissionDto } from "./dto/create-role-permission.dto";
import { RolePermission } from "./entities/role-permission.entity";
import { UpdateRolePermissionValueDto } from "./dto/update-role-permission-value.dto";
import { RolePermissionService } from "./role-permission.service";

@ApiTags("Role Permissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("role-permissions")
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @ApiOperation({ summary: "Create role permission" })
  @ApiCreatedResponse({
    description: "Role permission created successfully",
    type: RolePermission,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE_PERMISSION}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].CREATE}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE_PERMISSION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].CREATE,
  })
  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @ApiOperation({ summary: "List role permissions" })
  @ApiOkResponse({
    description: "Role permissions retrieved successfully",
    type: RolePermission,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE_PERMISSION}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].READ}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE_PERMISSION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].READ,
  })
  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

  @ApiOperation({ summary: "List permissions by role" })
  @ApiParam({ name: "roleId", description: "Role id" })
  @ApiOkResponse({
    description: "Permissions for role retrieved successfully",
    type: RolePermission,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE_PERMISSION}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].READ}' permission in your active role`,
  })
  @ApiNotFoundResponse({ description: "Role not found" })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE_PERMISSION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].READ,
  })
  @Get("role/:roleId")
  findAllByRoleId(@Param("roleId") roleId: string) {
    return this.rolePermissionService.findAllByRoleId(roleId);
  }

  @ApiOperation({ summary: "Update role permission scope" })
  @ApiParam({ name: "id", description: "Role permission id" })
  @ApiOkResponse({
    description: "Role permission value updated successfully",
    type: RolePermission,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE_PERMISSION}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].UPDATE}' permission in your active role`,
  })
  @ApiNotFoundResponse({ description: "Role permission not found" })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE_PERMISSION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].UPDATE,
  })
  @Patch(":id/value")
  updateValue(
    @Param("id") id: string,
    @Body() updateRolePermissionValueDto: UpdateRolePermissionValueDto,
  ) {
    return this.rolePermissionService.updateValue(
      id,
      updateRolePermissionValueDto,
    );
  }

  @ApiOperation({ summary: "Delete role permission" })
  @ApiParam({ name: "id", description: "Role permission id" })
  @ApiOkResponse({ description: "Role permission deleted successfully" })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE_PERMISSION}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].DELETE}' permission in your active role`,
  })
  @ApiNotFoundResponse({ description: "Role permission not found" })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE_PERMISSION,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE_PERMISSION].DELETE,
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rolePermissionService.remove(id);
  }
}
