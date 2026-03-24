import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductPropertyValueController } from './product-property-value.controller';
import { productPropertyValueProviders } from './product-property-value.provider';
import { ProductPropertyValueService } from './product-property-value.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductPropertyValueController],
  providers: [...productPropertyValueProviders, ProductPropertyValueService],
  exports: [...productPropertyValueProviders, ProductPropertyValueService],
})
export class ProductPropertyValueModule {}
