import { Sequelize } from 'sequelize-typescript';
import { Product } from '../product/entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';

export const productVariantProviders = [
  {
    provide: 'PRODUCT_VARIANT_REPOSITORY',
    useFactory: async (
      sequelize: Sequelize,
    ): Promise<typeof ProductVariant> => {
      sequelize.addModels([Product, ProductVariant]);
      await ProductVariant.sync();
      return ProductVariant;
    },
    inject: ['SEQUELIZE'],
  },
];
