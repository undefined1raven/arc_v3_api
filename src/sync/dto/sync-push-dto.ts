import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class SyncPushDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MutationDto)
  mutations!: MutationDto[];

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  deviceId!: string;

  @IsBoolean()
  @IsOptional()
  forcePush!: boolean;
}

class SyncPullDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  deviceId!: string;

  @IsNumber()
  lastCursor!: number;
}

class MutationDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 100)
  mutation_id!: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 100)
  account_id!: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 100)
  device_id!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  feature!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  chunk_id!: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  base_hash?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  hash!: string;

  @IsString()
  @IsNotEmpty()
  encrypted_content!: string;

  @IsNumber()
  updated_at!: number;

  @IsNumber()
  @IsOptional()
  time_range_start?: number;

  @IsNumber()
  @IsOptional()
  time_range_end?: number;

  @IsString()
  @IsOptional()
  @Length(1, 70)
  type?: string;

  @IsString()
  @Length(1, 10)
  version!: string;
}
export { SyncPushDto, MutationDto, SyncPullDto };
