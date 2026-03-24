import { Sequelize } from 'sequelize-typescript';
import { ProductAttributeKey } from '../product-attribute-key/entities/product-attribute-key.entity';
import { ProductAttributeValue } from '../product-attribute-value/entities/product-attribute-value.entity';
import { Variant } from '../variant/entities/variant.entity';
import { ProductAttributeKeyValueMapping } from './entities/product-attribute-key-value-mapping.entity';

export const productAttributeKeyValueMappingProviders = [
  {
    provide: 'PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductAttributeKeyValueMapping> => {
      sequelize.addModels([
        Variant,
        ProductAttributeKey,
        ProductAttributeValue,
        ProductAttributeKeyValueMapping,
      ]);
      await ProductAttributeKeyValueMapping.sync();
      return ProductAttributeKeyValueMapping;
    },
    inject: ['SEQUELIZE'],
  },
];