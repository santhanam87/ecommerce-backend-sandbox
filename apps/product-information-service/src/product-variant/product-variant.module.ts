import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductVariantController } from './product-variant.controller';
import { productVariantProviders } from './product-variant.provider';
import { ProductVariantService } from './product-variant.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductVariantController],
  providers: [...productVariantProviders, ProductVariantService],
  exports: [...productVariantProviders, ProductVariantService],
})
export class ProductVariantModule {}
