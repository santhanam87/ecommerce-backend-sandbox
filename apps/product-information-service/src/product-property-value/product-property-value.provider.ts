import { Sequelize } from 'sequelize-typescript';
import { ProductPropertyValue } from './entities/product-property-value.entity';

export const productPropertyValueProviders = [
  {
    provide: 'PRODUCT_PROPERTY_VALUE_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductPropertyValue> => {
      sequelize.addModels([ProductPropertyValue]);
      await ProductPropertyValue.sync();
      return ProductPropertyValue;
    },
    inject: ['SEQUELIZE'],
  },
];
