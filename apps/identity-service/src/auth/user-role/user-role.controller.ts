import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRole } from "./entities/user-role.entity";
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
  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto);
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
}
