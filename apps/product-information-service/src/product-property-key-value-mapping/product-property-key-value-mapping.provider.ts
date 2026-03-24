import { Sequelize } from 'sequelize-typescript';
import { ProductPropertyKeyValueMapping } from './entities/product-property-key-value-mapping.entity';

export const productPropertyKeyValueMappingProviders = [
  {
    provide: 'PRODUCT_PROPERTY_KEY_VALUE_MAPPING_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductPropertyKeyValueMapping> => {
      sequelize.addModels([ProductPropertyKeyValueMapping]);
      await ProductPropertyKeyValueMapping.sync();
      return ProductPropertyKeyValueMapping;
    },
    inject: ['SEQUELIZE'],
  },
];
