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

@Table({ tableName: "tenants", timestamps: true })
export class Tenant extends Model<Tenant> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare tenantName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare subscriptionType: string;

  @HasMany(() => User)
  declare users: User[];

  @HasMany(() => Role)
  declare roles: Role[];
}
