import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import AWSClientProxy from 'src/common/messaging/aws-client-proxy';

const TransactionClientProxy = {
  provide: 'PAYMENT_MESSAGE_CLIENT',
  useFactory: (config: ConfigService) => {
    const topicArn = config.get('AWS_PAYMENT_TOPIC_ARN') as string;
    return new AWSClientProxy(topicArn);
  },
  inject: [ConfigService],
};

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [TransactionClientProxy, PaymentService],
})
export class PaymentModule {}
