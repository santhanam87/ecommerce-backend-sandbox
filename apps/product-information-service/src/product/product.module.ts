import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { productProviders } from './product.provider';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [...productProviders, ProductService],
  exports: [...productProviders, ProductService],
})
export class ProductModule {}
