import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Table({
  tableName: 'transactions',
  timestamps: true,
})
export class Transaction extends Model<Transaction> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  uuid: string;

  @Column({
    type: DataType.ENUM('income', 'expense'),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
  })
  date: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  userUuid: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  categoryUuid: string;

  @BelongsTo(() => Category)
  category: Category;
}
