import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import { RoleService } from "./role.service";

@ApiTags("Roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: "Create role" })
  @ApiCreatedResponse({
    description: "Role created successfully",
    type: RoleResponseDto,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: "List roles" })
  @ApiOkResponse({
    description: "Roles retrieved successfully",
    type: RoleResponseDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
}
