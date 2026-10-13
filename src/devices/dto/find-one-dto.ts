import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindOneDeviceDto {
  @IsString()
  device_id!: string;

  @IsString()
  account_id!: string;
}
