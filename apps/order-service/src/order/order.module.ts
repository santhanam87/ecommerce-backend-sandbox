import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import AWSClientProxy from 'src/common/messaging/aws-client-proxy';

const OrderClientProxy = {
  provide: 'ORDER_MESSAGE_CLIENT',
  useFactory: (config: ConfigService) => {
    const topicArn = config.get('AWS_ORDER_TOPIC_ARN') as string;
    return new AWSClientProxy(topicArn);
  },
  inject: [ConfigService],
};

@Module({
  imports: [PrismaModule],
  providers: [OrderClientProxy, OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
