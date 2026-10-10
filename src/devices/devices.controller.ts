import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { FindOneDeviceDto } from './dto/find-one-dto';
import { RegistrationChallengeDto } from './dto/registration-challenge-dto';
import { DeviceRegistrationDto } from './dto/device-registration-dto copy';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('new')
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  // @Get()
  // findAll() {
  //   return this.devicesService.findAll();
  // }

  @Post('/findOne')
  findOne(@Body() findOne: FindOneDeviceDto) {
    return this.devicesService.findOne(findOne);
  }

  @Patch(':id/update')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.devicesService.remove(id);
  // }

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
