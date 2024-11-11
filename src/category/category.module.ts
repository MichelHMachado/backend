import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Category, Transaction, User])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
