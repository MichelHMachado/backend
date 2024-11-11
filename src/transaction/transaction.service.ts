import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { Category } from 'src/category/entities/category.entity';
import { Sequelize } from 'sequelize-typescript';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
    private categoryService: CategoryService,
    private sequelize: Sequelize,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.sequelize.transaction();
    const { userUuid, categoryName, ...transactionDto } = createTransactionDto;

    try {
      let category = await this.categoryService.findByName(
        categoryName,
        transaction,
      );

      if (!category) {
        category = await this.categoryService.create(
          { userUuid, name: categoryName },
          transaction,
        );
      }

      const financialTransaction = await this.transactionModel.create(
        { ...transactionDto, userUuid, categoryUuid: category.uuid },
        { transaction },
      );
      await transaction.commit();
      return financialTransaction;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        'Failed to create transaction: ' + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(limit: number = 100) {
    const financialTransactions = await this.transactionModel.findAll({
      limit,
      order: [['date', 'DESC']],
      include: [{ model: Category, as: 'category' }],
    });
    return financialTransactions;
  }

  async findAllByUserUuid(userUuid: string) {
    const financialTransactions = await this.transactionModel.findAll({
      where: { userUuid },
    });
    return financialTransactions;
  }

  async findOne(uuid: string) {
    const financialTransaction = await this.transactionModel.findByPk(uuid);
    return financialTransaction;
  }

  async update(uuid: string, updateTransactionDto: UpdateTransactionDto) {
    await this.transactionModel.update(updateTransactionDto, {
      where: { uuid },
    });
    const financialTransaction = await this.transactionModel.findByPk(uuid);
    return financialTransaction;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
