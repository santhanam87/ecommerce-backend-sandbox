import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Category } from '../category/entities/category.entity';
import { CategoryRuleCondition } from '../category-rule-condition/entities/category-rule-condition.entity';
import { CategoryRuleGroup } from '../category-rule-group/entities/category-rule-group.entity';
import { ProductAttributeKey } from '../product-attribute-key/entities/product-attribute-key.entity';
import { ProductAttributeKeyValueMapping } from '../product-attribute-key-value-mapping/entities/product-attribute-key-value-mapping.entity';
import { ProductAttributeValue } from '../product-attribute-value/entities/product-attribute-value.entity';
import { ProductPropertyKey } from '../product-property-key/entities/product-property-key.entity';
import { ProductPropertyKeyValueMapping } from '../product-property-key-value-mapping/entities/product-property-key-value-mapping.entity';
import { ProductPropertyValue } from '../product-property-value/entities/product-property-value.entity';
import { Product } from '../product/entities/product.entity';
import { Variant } from '../variant/entities/variant.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [
          Category,
          CategoryRuleGroup,
          CategoryRuleCondition,
          ProductAttributeKey,
          ProductAttributeValue,
          ProductPropertyKey,
          ProductPropertyValue,
          Product,
          Variant,
          ProductAttributeKeyValueMapping,
          ProductPropertyKeyValueMapping,
        ],
      });
      await sequelize.sync();
      console.info('Database connected successfully');
      return sequelize;
    },
  },
];
