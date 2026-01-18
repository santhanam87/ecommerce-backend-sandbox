import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { PrismaExceptionFilter } from './prisma/prisma.exception.filter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { MessageExceptionFilter } from './common/filter/rcp-exception.filter';
import { CcardModule } from './ccard/ccard.module';
import AWSClientProxy from './aws-transporter/aws-client-proxy';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STORE_SERVICE',
        transport: Transport.TCP,
      },
    ]),
    ClientsModule.register([]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductModule,
    InventoryModule,
    OrderModule,
    CategoryModule,
    CcardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'AWS_SNS_CLIENT',
      useFactory: (config: ConfigService) => {
        const topicArn = config.get('AWS_SNS_TOPIC_ARN') as string;
        return new AWSClientProxy(topicArn);
      },
      inject: [ConfigService],
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MessageExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
