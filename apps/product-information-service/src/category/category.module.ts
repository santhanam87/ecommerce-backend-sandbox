import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoryController } from './category.controller';
import { categoryProviders } from './category.provider';
import { CategoryService } from './category.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [...categoryProviders, CategoryService],
  exports: [...categoryProviders, CategoryService],
})
export class CategoryModule {}
