import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TursoDBModule } from 'src/turso/turso.module';

@Module({
  imports: [TursoDBModule],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
