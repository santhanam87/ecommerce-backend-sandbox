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
import { CheckPermission } from "../decorators/check-permission.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionGuard } from "../guards/permission.guard";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { TenantSubscriptionResponseDto } from "./dto/tenant-subscription-response.dto";
import { TenantStatusResponseDto } from "./dto/tenant-status-response.dto";
import { UpdateTenantSubscriptionDto } from "./dto/update-tenant-subscription.dto";
import { UpdateTenantStatusDto } from "./dto/update-tenant-status.dto";
import { Tenant } from "./entities/tenant.entity";
import { TenantService } from "./tenant.service";

@ApiTags("Tenants")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("tenants")
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @ApiOperation({ summary: "Create tenant" })
  @ApiCreatedResponse({
    description: "Tenant created successfully",
    type: Tenant,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.TENANT}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].CREATE}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.TENANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].CREATE,
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
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.TENANT}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].READ}' permission in your active role`,
  })
  @CheckPermission({
    key: PERMISSION_KEYS.TENANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].READ,
  })
  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @ApiOperation({ summary: "Update tenant status" })
  @ApiOkResponse({
    description: "Tenant status updated successfully",
    type: TenantStatusResponseDto,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.TENANT}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].UPDATE}' permission in your active role`,
  })
  @ApiNotFoundResponse({ description: "Tenant not found" })
  @CheckPermission({
    key: PERMISSION_KEYS.TENANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].UPDATE,
  })
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() updateTenantStatusDto: UpdateTenantStatusDto,
  ): Promise<TenantStatusResponseDto> {
    return this.tenantService.updateStatus(id, updateTenantStatusDto.status);
  }

  @ApiOperation({ summary: "Update tenant subscription" })
  @ApiOkResponse({
    description: "Tenant subscription updated successfully",
    type: TenantSubscriptionResponseDto,
  })
  @ApiForbiddenResponse({
    description: `Requires '${PERMISSION_KEYS.TENANT}.${PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].UPDATE}' permission in your active role`,
  })
  @ApiNotFoundResponse({ description: "Tenant not found" })
  @CheckPermission({
    key: PERMISSION_KEYS.TENANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.TENANT].UPDATE,
  })
  @Patch(":id/subscription")
  updateSubscription(
    @Param("id") id: string,
    @Body() updateTenantSubscriptionDto: UpdateTenantSubscriptionDto,
  ): Promise<TenantSubscriptionResponseDto> {
    return this.tenantService.updateSubscription(
      id,
      updateTenantSubscriptionDto.subscriptionType,
    );
  }
}
