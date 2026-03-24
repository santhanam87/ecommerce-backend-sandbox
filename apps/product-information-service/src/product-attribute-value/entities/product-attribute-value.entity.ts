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
import { ProductAttributeKeyValueMapping } from '../../product-attribute-key-value-mapping/entities/product-attribute-key-value-mapping.entity';
import { ProductAttributeKey } from '../../product-attribute-key/entities/product-attribute-key.entity';

@Table({
  tableName: 'attribute_values',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductAttributeValue extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => ProductAttributeKey)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attribute_id',
    references: {
      model: 'product_attribute_keys',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare attribute_id: string;

  @BelongsTo(() => ProductAttributeKey)
  declare attribute: ProductAttributeKey;

  @HasMany(() => ProductAttributeKeyValueMapping)
  declare variant_attribute_values: ProductAttributeKeyValueMapping[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare value: string;

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
