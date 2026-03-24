import { Sequelize } from 'sequelize-typescript';
import { ProductPropertyKey } from './entities/product-property-key.entity';

export const productPropertyKeyProviders = [
  {
    provide: 'PRODUCT_PROPERTY_KEY_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductPropertyKey> => {
      sequelize.addModels([ProductPropertyKey]);
      await ProductPropertyKey.sync();
      return ProductPropertyKey;
    },
    inject: ['SEQUELIZE'],
  },
];
