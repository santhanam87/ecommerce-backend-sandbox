import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { Tenant } from "./entities/tenant.entity";
import { TenantService } from "./tenant.service";

@ApiTags("Tenants")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("tenants")
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @ApiOperation({ summary: "Create tenant" })
  @ApiCreatedResponse({
    description: "Tenant created successfully",
    type: Tenant,
  })
  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @ApiOperation({ summary: "List tenants" })
  @ApiOkResponse({
    description: "Tenants retrieved successfully",
    type: Tenant,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.tenantService.findAll();
  }
}
