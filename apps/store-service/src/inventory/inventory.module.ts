import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AwsMessageModule } from 'src/aws-message/aws-message.module';
import { OrderCreatedHandler } from './inventory-order-created.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STORE_SERVICE',
        transport: Transport.TCP,
      },
    ]),
    AwsMessageModule.register([new OrderCreatedHandler()]),
    PrismaModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
