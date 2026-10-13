import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class RegistrationChallengeDto {
  @IsString()
  @Length(5, 100)
  device_id!: string;

  @IsString()
  @Length(5, 100)
  account_id!: string;
}
