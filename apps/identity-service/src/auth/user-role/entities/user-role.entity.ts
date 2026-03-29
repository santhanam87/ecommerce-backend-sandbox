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
import { User } from "../../user/entities/user.entity";

@Table({ tableName: "user_roles", timestamps: true })
export class UserRole extends Model<UserRole> {
  @ApiProperty({ example: "3bc8ae75-b926-47fb-888e-253d6bf9ca72" })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ApiProperty({ example: "8d79c6fe-f5b6-4a5d-b7d0-f7be4c74f1e9" })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @ApiProperty({ type: () => User })
  @BelongsTo(() => User)
  declare user: User;

  @ApiProperty({ example: "f90c5d7b-c1d2-4568-a4dd-7be4474847da" })
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  declare role_id: string;

  @ApiProperty({ type: () => Role })
  @BelongsTo(() => Role)
  declare role: Role;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare createdAt: Date;

  @ApiProperty({ example: "2026-03-28T09:30:00.000Z" })
  declare updatedAt: Date;
}
