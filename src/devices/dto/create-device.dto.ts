import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  device_id!: string;

  @IsString()
  device_public_key!: string;

  @IsNumber()
  created_at!: number;

  @IsString()
  account_id!: string;

  @IsString()
  device_name!: string;

  @IsNumber()
  last_seen!: number;

  @IsOptional()
  @IsNumber()
  revoked_at?: number;

  @IsString()
  private_key_backup!: string;
}
