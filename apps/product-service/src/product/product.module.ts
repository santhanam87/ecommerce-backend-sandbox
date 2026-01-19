import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import AWSClientProxy from 'src/common/messaging/aws-client-proxy';

const ProductClientProxy = {
  provide: 'PRODUCT_MESSAGE_CLIENT',
  useFactory: (config: ConfigService) => {
    const topicArn = config.get('AWS_PRODUCT_TOPIC_ARN') as string;
    return new AWSClientProxy(topicArn);
  },
  inject: [ConfigService],
};
@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductClientProxy, ProductService],
})
export class ProductModule {}
