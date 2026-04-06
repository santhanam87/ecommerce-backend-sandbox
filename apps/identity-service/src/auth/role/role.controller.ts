import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from "src/common/constants/permission.constants";
import { CheckPermission } from "../decorators/check-permission.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionGuard } from "../guards/permission.guard";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/role.entity";
import { RoleService } from "./role.service";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: "Create role" })
  @ApiCreatedResponse({
    description: "Role created successfully",
    type: Role,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE].CREATE}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE].CREATE,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: "List roles" })
  @ApiOkResponse({
    description: "Roles retrieved successfully",
    type: Role,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.ROLE}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE].READ}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.ROLE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.ROLE].READ,
  })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
}
