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
import { ProductPropertyKey } from '../../product-property-key/entities/product-property-key.entity';
import { ProductPropertyValue } from '../../product-property-value/entities/product-property-value.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Table({
  tableName: 'variant_property_values',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductPropertyKeyValueMapping extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => ProductVariant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'variant_id',
    references: {
      model: 'product_variants',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare variant_id: string;

  @BelongsTo(() => ProductVariant)
  declare variant: ProductVariant;

  @ForeignKey(() => ProductPropertyKey)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'property_key_id',
    references: {
      model: 'product_property_keys',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare property_key_id: string;

  @BelongsTo(() => ProductPropertyKey)
  declare property_key: ProductPropertyKey;

  @ForeignKey(() => ProductPropertyValue)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'property_value_id',
    references: {
      model: 'property_values',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare property_value_id: string;

  @BelongsTo(() => ProductPropertyValue)
  declare property_value: ProductPropertyValue;

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
