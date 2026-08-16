import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { TursoDBService } from 'src/turso/turso.service';

@Injectable()
export class DevicesService {
  constructor(private readonly turso: TursoDBService) {}

  async create(createDeviceDto: CreateDeviceDto) {
    await this.turso.queryDB(
      `INSERT INTO devices (
      device_id,
      device_public_key,
      created_at,
      account_id,
      device_name,
      last_seen
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(device_id) DO UPDATE SET
      device_public_key = excluded.device_public_key,
      created_at = excluded.created_at,
      account_id = excluded.account_id,
      device_name = excluded.device_name,
      last_seen = excluded.last_seen`,
      [
        createDeviceDto.device_id,
        createDeviceDto.device_public_key,
        createDeviceDto.created_at,
        createDeviceDto.account_id,
        createDeviceDto.device_name,
        createDeviceDto.last_seen,
      ],
    );
  }

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: string) {
    return `This action returns a #${id} device`;
  }

  update(id: string, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: string) {
    return `This action removes a #${id} device`;
  }
}
