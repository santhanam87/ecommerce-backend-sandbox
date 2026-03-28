import { Injectable } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { Tenant } from "./entities/tenant.entity";

@Injectable()
export class TenantService {
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return Tenant.create<Tenant>(createTenantDto as any);
  }

  async findAll(): Promise<Tenant[]> {
    return Tenant.findAll<Tenant>();
  }
}
