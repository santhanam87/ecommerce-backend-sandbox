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
import { UserRoleResponseDto } from "./dto/user-role-response.dto";
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
    type: UserRoleResponseDto,
  })
  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto);
  }

  @ApiOperation({ summary: "List user roles" })
  @ApiOkResponse({
    description: "User roles retrieved successfully",
    type: UserRoleResponseDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }
}
