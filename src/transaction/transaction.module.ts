import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, User, Category])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
