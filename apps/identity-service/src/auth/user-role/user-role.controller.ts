import {
  Body,
  Controller,
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
  ApiTags,
} from "@nestjs/swagger";
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from "src/common/constants/permission.constants";
import { GetUser } from "src/common/decorator/user.decorator";
import { CheckPermission } from "../decorators/check-permission.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionGuard } from "../guards/permission.guard";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRole } from "./entities/user-role.entity";
import { USER_ROLE_ERROR_MESSAGES } from "./user-role.constants";
import { UserRoleService } from "./user-role.service";

@ApiTags("User Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("user-roles")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ApiOperation({
    summary: "Assign a role to a user",
    description:
      "Create a new user-role mapping. The first role assigned to a user is automatically set as their active role.",
  })
  @ApiCreatedResponse({
    description: "User role created successfully",
    type: UserRole,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.USER_ROLE}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER_ROLE].CREATE}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.USER_ROLE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER_ROLE].CREATE,
    errorMessage: USER_ROLE_ERROR_MESSAGES.CANNOT_CREATE_USER_ROLE_MAPPING,
  })
  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto);
  }

  @ApiOperation({
    summary: "List all user-role mappings",
    description:
      "Retrieve all user-role mappings in the system. Requires read permission.",
  })
  @ApiOkResponse({
    description: "User roles retrieved successfully",
    type: UserRole,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.USER_ROLE}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER_ROLE].READ}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.USER_ROLE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER_ROLE].READ,
    errorMessage: USER_ROLE_ERROR_MESSAGES.CANNOT_READ_USER_ROLES,
  })
  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @ApiOperation({
    summary: "Switch active role for current user",
    description:
      "Set a specific user-role mapping as the active role. Only the user can update their own active role.",
  })
  @ApiOkResponse({
    description: "Active role updated successfully",
    type: UserRole,
  })
  @ApiForbiddenResponse({
    description: "Only the current user can update their own active role",
  })
  @ApiNotFoundResponse({
    description: USER_ROLE_ERROR_MESSAGES.USER_ROLE_NOT_FOUND,
  })
  @Patch(":id/active-role")
  setActiveRole(@Param("id") id: string, @GetUser("id") actorUserId: string) {
    return this.userRoleService.setActiveRole(id, actorUserId);
  }
}
