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
import { Product } from '../../product/entities/product.entity';
import { ProductAttributeKeyValueMapping } from '../../product-attribute-key-value-mapping/entities/product-attribute-key-value-mapping.entity';
import { ProductPropertyKeyValueMapping } from '../../product-property-key-value-mapping/entities/product-property-key-value-mapping.entity';

@Table({
  tableName: 'product_variants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductVariant extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare product_id: string;

  @BelongsTo(() => Product)
  declare product: Product;

  @HasMany(() => ProductAttributeKeyValueMapping)
  declare attribute_mappings: ProductAttributeKeyValueMapping[];

  @HasMany(() => ProductPropertyKeyValueMapping)
  declare property_mappings: ProductPropertyKeyValueMapping[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare sku: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: string;

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
