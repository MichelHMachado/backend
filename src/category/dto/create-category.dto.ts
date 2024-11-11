import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly name: string;

  @IsUUID()
  @IsOptional()
  readonly userUuid: string;
}
