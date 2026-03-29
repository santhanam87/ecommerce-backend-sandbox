import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ApiProperty({ example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8" })
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.UUID, allowNull: false })
  declare tenant_id: string;

  @BelongsTo(() => Tenant)
  declare tenant: Tenant;

  @ApiProperty({ example: "admin" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare createdAt: Date;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare updatedAt: Date;

  @HasMany(() => RolePermission)
  declare rolePermissions: RolePermission[];

  @HasMany(() => UserRole)
  declare userRoles: UserRole[];
}
