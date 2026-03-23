import { Sequelize } from 'sequelize-typescript';
import { Product } from './entities/product.entity';

export const productProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: async (sequelize: Sequelize): Promise<typeof Product> => {
      sequelize.addModels([Product]);
      await Product.sync();
      return Product;
    },
    inject: ['SEQUELIZE'],
  },
];
