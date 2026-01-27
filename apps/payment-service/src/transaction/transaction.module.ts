import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ConfigService } from '@nestjs/config';
import AWSClientProxy from 'src/common/messaging/aws-client-proxy';
import { PrismaModule } from 'src/prisma/prisma.module';

const TransactionClientProxy = {
  provide: 'ORDER_MESSAGE_CLIENT',
  useFactory: (config: ConfigService) => {
    const topicArn = config.get('AWS_PAYMENT_TOPIC_ARN') as string;
    return new AWSClientProxy(topicArn);
  },
  inject: [ConfigService],
};

@Module({
  imports: [PrismaModule],
  providers: [TransactionClientProxy, TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
