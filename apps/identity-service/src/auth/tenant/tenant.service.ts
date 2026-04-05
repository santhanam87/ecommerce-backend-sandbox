import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { TenantSubscriptionResponseDto } from "./dto/tenant-subscription-response.dto";
import { TenantStatusResponseDto } from "./dto/tenant-status-response.dto";
import { Tenant, TenantStatus } from "./entities/tenant.entity";

@Injectable()
export class TenantService {
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return Tenant.create<Tenant>(createTenantDto as any);
  }

  async findAll(): Promise<Tenant[]> {
    return Tenant.findAll<Tenant>();
  }

  async findStatus(id: string): Promise<TenantStatusResponseDto> {
    const tenant = await Tenant.findByPk<Tenant>(id);

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
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
      throw new NotFoundException("Tenant not found");
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
      throw new NotFoundException("Tenant not found");
    }

    await tenant.update({ subscriptionType });

    return {
      id: tenant.id,
      subscriptionType: tenant.subscriptionType,
    };
  }
}
