import { IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateDeviceDto } from './create-device.dto';

export class DeviceRegistrationPayloadDto {
  @ValidateNested()
  @Type(() => CreateDeviceDto)
  deviceInfo!: CreateDeviceDto;

  @IsString()
  @Length(1, 150)
  challenge!: string;
}

export class DeviceRegistrationDto {
  @ValidateNested()
  @Type(() => DeviceRegistrationPayloadDto)
  signedPayload!: DeviceRegistrationPayloadDto;

  @IsString()
  @Length(5, 100)
  signature!: string;
}
