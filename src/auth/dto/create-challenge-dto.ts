import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 100)
  accountId!: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(20, 100)
  deviceId!: string;
}
