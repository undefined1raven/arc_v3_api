import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { TursoDBService } from 'src/turso/turso.service';
import { FindOneDeviceDto } from './dto/find-one-dto';

@Injectable()
export class DevicesService {
  constructor(private readonly turso: TursoDBService) {}

  async create(createDeviceDto: CreateDeviceDto) {
    return await this.turso.queryDB(
      `INSERT INTO devices (
      device_id,
      device_public_key,
      created_at,
      account_id,
      device_name,
      last_seen,
      private_key_backup
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(device_id) DO UPDATE SET
      device_public_key = excluded.device_public_key,
      created_at = excluded.created_at,
      account_id = excluded.account_id,
      device_name = excluded.device_name,
      last_seen = excluded.last_seen,
      private_key_backup = excluded.private_key_backup`,

      [
        createDeviceDto.device_id,
        createDeviceDto.device_public_key,
        createDeviceDto.created_at,
        createDeviceDto.account_id,
        createDeviceDto.device_name,
        createDeviceDto.last_seen,
        createDeviceDto.private_key_backup,
      ],
    );
  }

  findAll() {
    return `This action returns all devices`;
  }

  async findOne(findOneDevice: FindOneDeviceDto) {
    const matchingDevice = await this.turso.queryDB(
      'SELECT * FROM devices WHERE device_id = ? AND account_id = ?',
      [findOneDevice.device_id, findOneDevice.account_id],
    );
    console.error('matchingDevice', matchingDevice);
    return matchingDevice;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const entries = Object.entries(updateDeviceDto).filter(
      ([, value]) => value !== undefined,
    );

    if (entries.length === 0) {
      return;
    }

    const updates = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = [...entries.map(([, value]) => value), id];

    await this.turso.queryDB(
      `UPDATE devices SET ${updates} WHERE device_id = ?`,
      values,
    );
  }

  remove(id: string) {
    return `This action removes a #${id} device`;
  }
}
