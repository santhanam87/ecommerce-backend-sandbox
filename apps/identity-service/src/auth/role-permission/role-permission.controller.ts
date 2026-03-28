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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateRolePermissionDto } from "./dto/create-role-permission.dto";
import { RolePermissionResponseDto } from "./dto/role-permission-response.dto";
import { UpdateRolePermissionValueDto } from "./dto/update-role-permission-value.dto";
import { RolePermissionService } from "./role-permission.service";

@ApiTags("Role Permissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("role-permissions")
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @ApiOperation({ summary: "Create role permission" })
  @ApiCreatedResponse({
    description: "Role permission created successfully",
    type: RolePermissionResponseDto,
  })
  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @ApiOperation({ summary: "List role permissions" })
  @ApiOkResponse({
    description: "Role permissions retrieved successfully",
    type: RolePermissionResponseDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

  @ApiOperation({ summary: "Update role permission value" })
  @ApiParam({ name: "id", description: "Role permission id" })
  @ApiOkResponse({
    description: "Role permission value updated successfully",
    type: RolePermissionResponseDto,
  })
  @ApiNotFoundResponse({ description: "Role permission not found" })
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
}
