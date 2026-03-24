import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ProductPropertyKeyValueMapping } from '../../product-property-key-value-mapping/entities/product-property-key-value-mapping.entity';
import { ProductPropertyValue } from '../../product-property-value/entities/product-property-value.entity';
import { CategoryRuleCondition } from '../../category-rule-condition/entities/category-rule-condition.entity';

@Table({
  tableName: 'product_property_keys',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductPropertyKey extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => ProductPropertyValue)
  declare property_values: ProductPropertyValue[];

  @HasMany(() => ProductPropertyKeyValueMapping)
  declare variant_property_values: ProductPropertyKeyValueMapping[];

  @HasMany(() => CategoryRuleCondition)
  declare rule_conditions: CategoryRuleCondition[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare updated_at: Date;
}
