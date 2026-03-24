import { Sequelize } from 'sequelize-typescript';
import { ProductAttributeKey } from '../product-attribute-key/entities/product-attribute-key.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';

export const productAttributeValueProviders = [
  {
    provide: 'PRODUCT_ATTRIBUTE_VALUE_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductAttributeValue> => {
      sequelize.addModels([ProductAttributeKey, ProductAttributeValue]);
      await ProductAttributeValue.sync();
      return ProductAttributeValue;
    },
    inject: ['SEQUELIZE'],
  },
];