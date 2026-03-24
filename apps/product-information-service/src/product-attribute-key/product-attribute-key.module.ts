import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductAttributeKeyController } from './product-attribute-key.controller';
import { productAttributeKeyProviders } from './product-attribute-key.provider';
import { ProductAttributeKeyService } from './product-attribute-key.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductAttributeKeyController],
  providers: [...productAttributeKeyProviders, ProductAttributeKeyService],
  exports: [...productAttributeKeyProviders, ProductAttributeKeyService],
})
export class ProductAttributeKeyModule {}
