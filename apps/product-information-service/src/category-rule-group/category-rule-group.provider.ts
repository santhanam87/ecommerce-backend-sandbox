import { Sequelize } from 'sequelize-typescript';
import { CategoryRuleGroup } from './entities/category-rule-group.entity';

export const categoryRuleGroupProviders = [
  {
    provide: 'CATEGORY_RULE_GROUP_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof CategoryRuleGroup> => {
      sequelize.addModels([CategoryRuleGroup]);
      await CategoryRuleGroup.sync();
      return CategoryRuleGroup;
    },
    inject: ['SEQUELIZE'],
  },
];
