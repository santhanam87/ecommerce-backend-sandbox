import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoryRuleConditionController } from './category-rule-condition.controller';
import { categoryRuleConditionProviders } from './category-rule-condition.provider';
import { CategoryRuleConditionService } from './category-rule-condition.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryRuleConditionController],
  providers: [...categoryRuleConditionProviders, CategoryRuleConditionService],
  exports: [...categoryRuleConditionProviders, CategoryRuleConditionService],
})
export class CategoryRuleConditionModule {}
