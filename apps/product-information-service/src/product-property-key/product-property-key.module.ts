import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductPropertyKeyController } from './product-property-key.controller';
import { productPropertyKeyProviders } from './product-property-key.provider';
import { ProductPropertyKeyService } from './product-property-key.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductPropertyKeyController],
  providers: [...productPropertyKeyProviders, ProductPropertyKeyService],
  exports: [...productPropertyKeyProviders, ProductPropertyKeyService],
})
export class ProductPropertyKeyModule {}
