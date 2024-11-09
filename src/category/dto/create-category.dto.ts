import { IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly name: string;

  @IsUUID()
  readonly userUuid: string;
}
