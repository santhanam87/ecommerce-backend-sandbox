import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Role } from "../../role/entities/role.entity";
import { User } from "../../user/entities/user.entity";

export enum TenantStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
}

@Table({ tableName: "tenants", timestamps: true })
export class Tenant extends Model<Tenant> {
  @ApiProperty({ example: "7c7f52ff-4b90-4b87-8bf9-4c235db630f8" })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ApiProperty({ example: "acme" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare tenantName: string;

  @ApiProperty({ example: "premium" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare subscriptionType: string;

  @ApiProperty({
    example: TenantStatus.ACTIVE,
    enum: TenantStatus,
  })
  @Default(TenantStatus.ACTIVE)
  @Column({ type: DataType.STRING, allowNull: false })
  declare status: TenantStatus;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare createdAt: Date;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare updatedAt: Date;

  @HasMany(() => User)
  declare users: User[];

  @HasMany(() => Role)
  declare roles: Role[];
}
