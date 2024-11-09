import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction)
    private readonly transactionModel: typeof Transaction,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const financialTransaction =
      await this.transactionModel.create(createTransactionDto);
    return financialTransaction;
  }

  async findAll() {
    const financialTransactions = await this.transactionModel.findAll();
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
