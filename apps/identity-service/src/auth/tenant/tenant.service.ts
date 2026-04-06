import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UniqueConstraintError } from "sequelize";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { TenantSubscriptionResponseDto } from "./dto/tenant-subscription-response.dto";
import { TenantStatusResponseDto } from "./dto/tenant-status-response.dto";
import { TENANT_ERROR_MESSAGES } from "./tenant.constants";
import { Tenant, TenantStatus } from "./entities/tenant.entity";

@Injectable()
export class TenantService {
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await Tenant.findOne<Tenant>({
      where: { tenantName: createTenantDto.tenantName },
    });

    if (existingTenant) {
      throw new ConflictException(
        TENANT_ERROR_MESSAGES.TENANT_NAME_ALREADY_EXISTS,
      );
    }

    try {
      return await Tenant.create<Tenant>(createTenantDto as any);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException(
          TENANT_ERROR_MESSAGES.TENANT_NAME_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Tenant[]> {
    return Tenant.findAll<Tenant>();
  }

  async findStatus(id: string): Promise<TenantStatusResponseDto> {
    const tenant = await Tenant.findByPk<Tenant>(id);

    if (!tenant) {
      throw new NotFoundException(TENANT_ERROR_MESSAGES.TENANT_NOT_FOUND);
    }

    return {
      id: tenant.id,
      status: tenant.status,
    };
  }

  async updateStatus(
    id: string,
    status: TenantStatus,
  ): Promise<TenantStatusResponseDto> {
    const tenant = await Tenant.findByPk<Tenant>(id);

    if (!tenant) {
      throw new NotFoundException(TENANT_ERROR_MESSAGES.TENANT_NOT_FOUND);
    }

    await tenant.update({ status });

    return {
      id: tenant.id,
      status: tenant.status,
    };
  }

  async updateSubscription(
    id: string,
    subscriptionType: string,
  ): Promise<TenantSubscriptionResponseDto> {
    const tenant = await Tenant.findByPk<Tenant>(id);

    if (!tenant) {
      throw new NotFoundException(TENANT_ERROR_MESSAGES.TENANT_NOT_FOUND);
    }

    await tenant.update({ subscriptionType });

    return {
      id: tenant.id,
      subscriptionType: tenant.subscriptionType,
    };
  }
}
