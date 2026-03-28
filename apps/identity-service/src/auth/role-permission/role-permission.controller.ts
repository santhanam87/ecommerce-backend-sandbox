import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateRolePermissionDto } from "./dto/create-role-permission.dto";
import { UpdateRolePermissionValueDto } from "./dto/update-role-permission-value.dto";
import { RolePermissionService } from "./role-permission.service";

@UseGuards(JwtAuthGuard)
@Controller("role-permissions")
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

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
