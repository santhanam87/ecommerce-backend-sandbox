import { Sequelize } from 'sequelize-typescript';
import { Category } from './entities/category.entity';

export const categoryProviders = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: async (sequelize: Sequelize): Promise<typeof Category> => {
      sequelize.addModels([Category]);
      await Category.sync();
      return Category;
    },
    inject: ['SEQUELIZE'],
  },
];
