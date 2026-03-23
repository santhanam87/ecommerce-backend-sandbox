import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VariantController } from './variant.controller';
import { variantProviders } from './variant.provider';
import { VariantService } from './variant.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VariantController],
  providers: [...variantProviders, VariantService],
  exports: [...variantProviders, VariantService],
})
export class VariantModule {}
