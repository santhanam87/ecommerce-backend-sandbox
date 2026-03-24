import { Sequelize } from 'sequelize-typescript';
import { ProductAttributeKey } from './entities/product-attribute-key.entity';

export const productAttributeKeyProviders = [
  {
    provide: 'PRODUCT_ATTRIBUTE_KEY_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductAttributeKey> => {
      sequelize.addModels([ProductAttributeKey]);
      await ProductAttributeKey.sync();
      return ProductAttributeKey;
    },
    inject: ['SEQUELIZE'],
  },
];
