import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Role } from "../../role/entities/role.entity";

@Table({ tableName: "role_permissions", timestamps: true })
export class RolePermission extends Model<RolePermission> {
  @ApiProperty({ example: "2f5d4f22-f414-4d6a-8b8c-9f15d37d66e2" })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  declare role_id: string;

  @ApiProperty({ type: () => Role })
  @BelongsTo(() => Role)
  declare role: Role;

  @ApiProperty({ example: "product" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare permission: string;

  @ApiProperty({ example: { allow: true, scopes: ["all"] } })
  @Column({ type: DataType.JSON, allowNull: false })
  declare value: Record<string, unknown>;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare createdAt: Date;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare updatedAt: Date;
}
