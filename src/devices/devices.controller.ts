import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { FindOneDeviceDto } from './dto/find-one-dto';
import { RegistrationChallengeDto } from './dto/registration-challenge-dto';
import { DeviceRegistrationDto } from './dto/device-registration-dto copy';
import { AuthGuard } from 'src/auth/guards/auth-guard';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('/findOne')
  findOne(@Body() findOne: FindOneDeviceDto) {
    return this.devicesService.findOne(findOne);
  }

  @Patch(':id/update')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Post('/registration/challenge')
  registrationChallenge(
    @Body() registrationChallenge: RegistrationChallengeDto,
  ) {
    return this.devicesService.registrationChallenge(registrationChallenge);
  }

  @Post('/registration/submit')
  registrationSubmit(@Body() registrationSubmit: DeviceRegistrationDto) {
    return this.devicesService.registrationSubmit(registrationSubmit);
  }
}
