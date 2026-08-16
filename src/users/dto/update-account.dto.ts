import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  @IsNotEmpty()
  signupTime!: number;

  @IsOptional()
  @IsString()
  PIKBackup?: string | null;

  @IsOptional()
  @IsString()
  PSKBackup?: string | null;

  @IsOptional()
  @IsString()
  RCKBackup?: string | null;

  @IsString()
  @IsNotEmpty()
  version!: string;
}
