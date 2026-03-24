import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoryRuleGroupController } from './category-rule-group.controller';
import { categoryRuleGroupProviders } from './category-rule-group.provider';
import { CategoryRuleGroupService } from './category-rule-group.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryRuleGroupController],
  providers: [...categoryRuleGroupProviders, CategoryRuleGroupService],
  exports: [...categoryRuleGroupProviders, CategoryRuleGroupService],
})
export class CategoryRuleGroupModule {}
