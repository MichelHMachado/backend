import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;
}
