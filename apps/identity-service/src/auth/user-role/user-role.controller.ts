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
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRole } from "./entities/user-role.entity";
import { USER_ROLE_ERROR_MESSAGES } from "./user-role.constants";
import { UserRoleService } from "./user-role.service";

@ApiTags("User Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("user-roles")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ApiOperation({ summary: "Assign role to user" })
  @ApiCreatedResponse({
    description: "User role created successfully",
    type: UserRole,
  })
  @ApiForbiddenResponse({
    description: `Only a user with ${PERMISSION_KEYS.USER_ROLE}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER_ROLE].CREATE} in active role can create user-role mapping`,
  })
  @Post()
  create(
    @Body() createUserRoleDto: CreateUserRoleDto,
    @GetUser("id") actorUserId: string,
  ) {
    return this.userRoleService.create(createUserRoleDto, actorUserId);
  }

  @ApiOperation({ summary: "List user roles" })
  @ApiOkResponse({
    description: "User roles retrieved successfully",
    type: UserRole,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @ApiOperation({ summary: "Set active role mapping" })
  @ApiOkResponse({
    description: "Active role updated successfully",
    type: UserRole,
  })
  @ApiForbiddenResponse({
    description: "Only the current user can update their active role",
  })
  @ApiNotFoundResponse({
    description: USER_ROLE_ERROR_MESSAGES.USER_ROLE_NOT_FOUND,
  })
  @Patch(":id/active-role")
  setActiveRole(@Param("id") id: string, @GetUser("id") actorUserId: string) {
    return this.userRoleService.setActiveRole(id, actorUserId);
  }
}
