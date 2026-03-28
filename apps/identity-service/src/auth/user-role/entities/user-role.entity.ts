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
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  declare role_id: string;

  @BelongsTo(() => Role)
  declare role: Role;
}
