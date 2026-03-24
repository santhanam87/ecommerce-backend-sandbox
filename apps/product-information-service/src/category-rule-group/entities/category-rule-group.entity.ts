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
import { Category } from '../../category/entities/category.entity';
import { CategoryRuleCondition } from '../../category-rule-condition/entities/category-rule-condition.entity';

@Table({
  tableName: 'category_rule_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CategoryRuleGroup extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'category_id',
    references: {
      model: 'categories',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare category_id: string;

  @BelongsTo(() => Category)
  declare category: Category;

  @ForeignKey(() => CategoryRuleGroup)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'parent_group_id',
    references: {
      model: 'category_rule_groups',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare parent_group_id: string | null;

  @BelongsTo(() => CategoryRuleGroup, 'parent_group_id')
  declare parent_group: CategoryRuleGroup;

  @HasMany(() => CategoryRuleGroup, 'parent_group_id')
  declare child_groups: CategoryRuleGroup[];

  @HasMany(() => CategoryRuleCondition)
  declare conditions: CategoryRuleCondition[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare operator: string;

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
