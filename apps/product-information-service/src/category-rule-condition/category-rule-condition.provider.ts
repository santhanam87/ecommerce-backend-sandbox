import { Sequelize } from 'sequelize-typescript';
import { CategoryRuleCondition } from './entities/category-rule-condition.entity';

export const categoryRuleConditionProviders = [
  {
    provide: 'CATEGORY_RULE_CONDITION_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof CategoryRuleCondition> => {
      sequelize.addModels([CategoryRuleCondition]);
      await CategoryRuleCondition.sync();
      return CategoryRuleCondition;
    },
    inject: ['SEQUELIZE'],
  },
];
