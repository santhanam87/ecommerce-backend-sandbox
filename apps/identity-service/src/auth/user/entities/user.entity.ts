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
import { Tenant } from "../../tenant/entities/tenant.entity";
import { UserRole } from "../../user-role/entities/user-role.entity";

@Table({ tableName: "users", timestamps: true })
export class User extends Model<User> {
  @ApiProperty({ example: "8d79c6fe-f5b6-4a5d-b7d0-f7be4c74f1e9" })
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

  @ApiProperty({ example: "user@example.com" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @ApiProperty({ example: "strong-password" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare createdAt: Date;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare updatedAt: Date;

  @HasMany(() => UserRole)
  declare userRoles: UserRole[];
}
