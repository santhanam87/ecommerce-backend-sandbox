import { Module } from '@nestjs/common';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { VariantModule } from './variant/variant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(__dirname, '..', '.env'),
      ],
      isGlobal: true,
    }),
    DatabaseModule,
    ProductModule,
    VariantModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
