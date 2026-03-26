import { Module } from '@nestjs/common';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { CategoryModule } from './category/category.module';
import { CategoryRuleConditionModule } from './category-rule-condition/category-rule-condition.module';
import { CategoryRuleGroupModule } from './category-rule-group/category-rule-group.module';
import { DatabaseModule } from './database/database.module';
import { ProductAttributeKeyModule } from './product-attribute-key/product-attribute-key.module';
import { ProductAttributeKeyValueMappingModule } from './product-attribute-key-value-mapping/product-attribute-key-value-mapping.module';
import { ProductAttributeValueModule } from './product-attribute-value/product-attribute-value.module';
import { ProductPropertyKeyModule } from './product-property-key/product-property-key.module';
import { ProductPropertyKeyValueMappingModule } from './product-property-key-value-mapping/product-property-key-value-mapping.module';
import { ProductPropertyValueModule } from './product-property-value/product-property-value.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(__dirname, '..', '.env'),
      ],
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'products',
        module: ProductModule,
        children: [
          {
            path: 'categories',
            module: CategoryModule,
          },
          {
            path: 'category-rule-groups',
            module: CategoryRuleGroupModule,
          },
          {
            path: 'category-rule-conditions',
            module: CategoryRuleConditionModule,
          },
          {
            path: 'variants',
            module: ProductVariantModule,
          },
          {
            path: 'attribute-keys',
            module: ProductAttributeKeyModule,
          },
          {
            path: 'attribute-values',
            module: ProductAttributeValueModule,
          },
          {
            path: 'attribute-key-value-mappings',
            module: ProductAttributeKeyValueMappingModule,
          },
          {
            path: 'property-keys',
            module: ProductPropertyKeyModule,
          },
          {
            path: 'property-values',
            module: ProductPropertyValueModule,
          },
          {
            path: 'property-key-value-mappings',
            module: ProductPropertyKeyValueMappingModule,
          },
        ],
      },
    ]),
    DatabaseModule,
    CategoryModule,
    CategoryRuleConditionModule,
    CategoryRuleGroupModule,
    ProductAttributeKeyModule,
    ProductAttributeKeyValueMappingModule,
    ProductAttributeValueModule,
    ProductPropertyKeyModule,
    ProductPropertyKeyValueMappingModule,
    ProductPropertyValueModule,
    ProductModule,
    ProductVariantModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
