import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    const userUuid = req['user']?.uuid;
    if (!userUuid) {
      return { message: 'User not authenticated' };
    }
    return this.transactionService.create({
      userUuid,
      ...createTransactionDto,
    });
  }

  @Get(':limit?')
  findAll(@Param('limit') limit?: number) {
    return this.transactionService.findAll(limit || 100);
  }

  @Get('details:uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.transactionService.findOne(uuid);
  }

  @Get('/user/:uuid')
  findAllByUserUuid(@Param('uuid') uuid: string) {
    return this.transactionService.findAllByUserUuid(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(uuid, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
