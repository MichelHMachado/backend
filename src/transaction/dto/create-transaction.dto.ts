import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  readonly type: string;

  @IsNumber()
  readonly amount: number;

  @IsDateString()
  readonly date: string;

  @IsUUID()
  readonly userUuid: string;

  @IsUUID()
  readonly categoryUuid: string;
}
