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
import { CategoryRuleGroup } from '../../category-rule-group/entities/category-rule-group.entity';
import { ProductPropertyKey } from '../../product-property-key/entities/product-property-key.entity';

@Table({
  tableName: 'category_rule_conditions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CategoryRuleCondition extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => CategoryRuleGroup)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'group_id',
    references: {
      model: 'category_rule_groups',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare group_id: string;

  @BelongsTo(() => CategoryRuleGroup)
  declare group: CategoryRuleGroup;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare operator: string;

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
