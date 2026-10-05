import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateDeviceDto } from 'src/devices/dto/create-device.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  @IsNotEmpty()
  signupTime!: number;

  @IsOptional()
  @IsString()
  PIKBackup?: string;

  @IsOptional()
  @IsString()
  PSKBackup?: string;

  @IsOptional()
  @IsString()
  RCKBackup?: string;

  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsString()
  @IsNotEmpty()
  publicKey!: string;
}

export class CreateUserDeviceDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  userPayload!: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateDeviceDto)
  devicePayload!: CreateDeviceDto;
}
