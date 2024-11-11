import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Transaction } from './entities/transaction.entity';
import { UserMiddleware } from 'src/middleware/user.middleware';
import { JwtService } from '@nestjs/jwt';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, User, Category])],
  controllers: [TransactionController],
  providers: [TransactionService, JwtService, CategoryService],
})
export class TransactionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TransactionController);
  }
}
