import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import AWSClientProxy from 'src/common/messaging/aws-client-proxy';

const InventoryClientProxy = {
  provide: 'INVENTORY_MESSAGE_CLIENT',
  useFactory: (config: ConfigService) => {
    const topicArn = config.get('AWS_INVENTORY_TOPIC_ARN') as string;
    return new AWSClientProxy(topicArn);
  },
  inject: [ConfigService],
};

@Module({
  imports: [PrismaModule],
  providers: [InventoryClientProxy, InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
