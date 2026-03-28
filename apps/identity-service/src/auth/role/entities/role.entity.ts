import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { RolePermission } from "../../role-permission/entities/role-permission.entity";
import { Tenant } from "../../tenant/entities/tenant.entity";
import { UserRole } from "../../user-role/entities/user-role.entity";

@Table({ tableName: "roles", timestamps: true })
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Tenant)
  @Column({ type: DataType.UUID, allowNull: false })
  declare tenant_id: string;

  @BelongsTo(() => Tenant)
  declare tenant: Tenant;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @HasMany(() => RolePermission)
  declare rolePermissions: RolePermission[];

  @HasMany(() => UserRole)
  declare userRoles: UserRole[];
}
