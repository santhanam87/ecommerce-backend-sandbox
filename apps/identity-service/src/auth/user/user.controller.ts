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
import type { AccessTokenPayload } from "src/auth/types/token-payload.type";
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from "src/common/constants/permission.constants";
import { GetUser } from "src/common/decorator/user.decorator";
import { CheckPermission } from "../decorators/check-permission.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionGuard } from "../guards/permission.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserActiveDto } from "./dto/update-user-active.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Create user" })
  @ApiCreatedResponse({
    description: "User created successfully",
    type: User,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.USER}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER].CREATE}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.USER,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER].CREATE,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: "List users" })
  @ApiOkResponse({
    description: "Users retrieved successfully",
    type: User,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.USER}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER].READ}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.USER,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER].READ,
  })
  @Get()
  findAll(@GetUser() user: AccessTokenPayload) {
    console.log("Authenticated user payload:", user);
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "Update user active status" })
  @ApiOkResponse({
    description: "User active status updated successfully",
    type: User,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.USER}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER].UPDATE}' permission in your active role`,
  })
  @ApiNotFoundResponse({ description: "User not found" })
  @CheckPermission({
    key: PERMISSION_KEYS.USER,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.USER].UPDATE,
  })
  @Patch(":id/is-active")
  updateIsActive(
    @Param("id") id: string,
    @Body() updateUserActiveDto: UpdateUserActiveDto,
  ) {
    return this.userService.updateIsActive(id, updateUserActiveDto.is_active);
  }
}
