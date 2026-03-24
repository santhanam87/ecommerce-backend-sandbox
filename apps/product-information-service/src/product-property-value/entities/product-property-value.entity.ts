import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ProductPropertyKeyValueMapping } from '../../product-property-key-value-mapping/entities/product-property-key-value-mapping.entity';
import { ProductPropertyKey } from '../../product-property-key/entities/product-property-key.entity';

@Table({
  tableName: 'property_values',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductPropertyValue extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => ProductPropertyKey)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'property_id',
    references: {
      model: 'product_property_keys',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare property_id: string;

  @BelongsTo(() => ProductPropertyKey)
  declare property: ProductPropertyKey;

  @HasMany(() => ProductPropertyKeyValueMapping)
  declare variant_property_values: ProductPropertyKeyValueMapping[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare value: string;

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
