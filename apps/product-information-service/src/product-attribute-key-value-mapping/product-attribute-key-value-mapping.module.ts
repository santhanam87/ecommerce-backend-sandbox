import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductAttributeKeyValueMappingController } from './product-attribute-key-value-mapping.controller';
import { productAttributeKeyValueMappingProviders } from './product-attribute-key-value-mapping.provider';
import { ProductAttributeKeyValueMappingService } from './product-attribute-key-value-mapping.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductAttributeKeyValueMappingController],
  providers: [
    ...productAttributeKeyValueMappingProviders,
    ProductAttributeKeyValueMappingService,
  ],
  exports: [
    ...productAttributeKeyValueMappingProviders,
    ProductAttributeKeyValueMappingService,
  ],
})
export class ProductAttributeKeyValueMappingModule {}
