import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

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
}
