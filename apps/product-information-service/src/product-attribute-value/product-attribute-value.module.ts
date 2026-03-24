import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductAttributeValueController } from './product-attribute-value.controller';
import { productAttributeValueProviders } from './product-attribute-value.provider';
import { ProductAttributeValueService } from './product-attribute-value.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductAttributeValueController],
  providers: [...productAttributeValueProviders, ProductAttributeValueService],
  exports: [...productAttributeValueProviders, ProductAttributeValueService],
})
export class ProductAttributeValueModule {}