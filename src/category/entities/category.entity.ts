import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';

@Table({
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
})
export class Category extends Model<Category> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  uuid: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  userUuid: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
