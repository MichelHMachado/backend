import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  readonly type: string;

  @IsNumber()
  readonly amount: number;

  @IsDateString()
  readonly date: string;

  @IsUUID()
  @IsOptional()
  readonly userUuid: string;

  @IsUUID()
  @IsOptional()
  readonly categoryUuid: string;

  @IsString()
  @IsOptional()
  categoryName?: string;
}
