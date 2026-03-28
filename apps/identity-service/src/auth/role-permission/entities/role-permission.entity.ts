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
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  declare role_id: string;

  @BelongsTo(() => Role)
  declare role: Role;

  @Column({ type: DataType.STRING, allowNull: false })
  declare permission: string;

  @Column({ type: DataType.JSON, allowNull: false })
  declare value: Record<string, unknown>;
}
