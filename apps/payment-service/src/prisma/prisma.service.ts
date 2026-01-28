import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
//implements OnModuleInit, OnModuleDestroy
export class PrismaService extends PrismaClient {
  constructor() {
    // Load the connection string from environment variables
    const connectionString = process.env.DATABASE_URL as string;
    // Instantiate the PostgreSQL adapter
    const adapter = new PrismaPg({ connectionString });

    // Pass the adapter to the PrismaClient constructor
    super({ adapter });
  }

  // async onModuleInit() {
  //   await this.$connect();
  // }

  // async onModuleDestroy() {
  //   await this.$disconnect();
  // }
}
