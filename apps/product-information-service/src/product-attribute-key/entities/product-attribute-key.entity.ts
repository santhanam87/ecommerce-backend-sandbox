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
import { ProductAttributeKeyValueMapping } from '../../product-attribute-key-value-mapping/entities/product-attribute-key-value-mapping.entity';
import { ProductAttributeValue } from '../../product-attribute-value/entities/product-attribute-value.entity';

@Table({
  tableName: 'product_attribute_keys',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductAttributeKey extends Model {
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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_variant: boolean;

  @HasMany(() => ProductAttributeValue)
  declare attribute_values: ProductAttributeValue[];

  @HasMany(() => ProductAttributeKeyValueMapping)
  declare variant_attribute_values: ProductAttributeKeyValueMapping[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updated_at: Date;
}
