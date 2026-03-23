import { Sequelize } from 'sequelize-typescript';
import { Product } from '../product/entities/product.entity';
import { Variant } from './entities/variant.entity';

export const variantProviders = [
  {
    provide: 'VARIANT_REPOSITORY',
    useFactory: async (sequelize: Sequelize): Promise<typeof Variant> => {
      sequelize.addModels([Product, Variant]);
      await Variant.sync();
      return Variant;
    },
    inject: ['SEQUELIZE'],
  },
];
