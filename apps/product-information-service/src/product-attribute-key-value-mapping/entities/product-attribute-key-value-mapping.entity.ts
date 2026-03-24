import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ProductAttributeKey } from '../../product-attribute-key/entities/product-attribute-key.entity';
import { ProductAttributeValue } from '../../product-attribute-value/entities/product-attribute-value.entity';
import { Variant } from '../../variant/entities/variant.entity';

@Table({
  tableName: 'variant_attribute_values',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductAttributeKeyValueMapping extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Variant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'variant_id',
    references: {
      model: 'variants',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare variant_id: string;

  @BelongsTo(() => Variant)
  declare variant: Variant;

  @ForeignKey(() => ProductAttributeKey)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attribute_key_id',
    references: {
      model: 'product_attribute_keys',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare attribute_key_id: string;

  @BelongsTo(() => ProductAttributeKey)
  declare attribute_key: ProductAttributeKey;

  @ForeignKey(() => ProductAttributeValue)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attribute_value_id',
    references: {
      model: 'attribute_values',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare attribute_value_id: string;

  @BelongsTo(() => ProductAttributeValue)
  declare attribute_value: ProductAttributeValue;

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
