import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductPropertyKeyValueMappingController } from './product-property-key-value-mapping.controller';
import { productPropertyKeyValueMappingProviders } from './product-property-key-value-mapping.provider';
import { ProductPropertyKeyValueMappingService } from './product-property-key-value-mapping.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductPropertyKeyValueMappingController],
  providers: [
    ...productPropertyKeyValueMappingProviders,
    ProductPropertyKeyValueMappingService,
  ],
  exports: [
    ...productPropertyKeyValueMappingProviders,
    ProductPropertyKeyValueMappingService,
  ],
})
export class ProductPropertyKeyValueMappingModule {}
