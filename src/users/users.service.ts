import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDeviceDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { TursoDBService } from '../turso/turso.service';
import { InArgs } from '@libsql/client';

const deviceTableMap = {
  device_id: 'device_id',
  device_public_key: 'device_public_key',
  created_at: 'created_at',
  account_id: 'account_id',
  device_name: 'device_name',
  last_seen: 'last_seen',
  private_key_backup: 'private_key_backup',
};

const userTableMap = {
  id: 'id',
  signupTime: 'signupTime',
  PIKBackup: 'PIKBackup',
  PSKBackup: 'PSKBackup',
  RCKBackup: 'RCKBackup',
  version: 'version',
};
@Injectable()
export class UsersService {
  constructor(private readonly turso: TursoDBService) {}

  async create(createUserDeviceDto: CreateUserDeviceDto) {
    const userDeviceDto = createUserDeviceDto.userPayload;
    const deviceDto = createUserDeviceDto.devicePayload;

    function procecssDto(dto, tableName: 'users' | 'devices') {
      const entries = Object.entries(dto).filter(([, v]) => v !== undefined);
      if (!entries.length) {
        throw new BadRequestException(`Bad data provided. [${tableName}]`);
      }

      let cols = '';
      if (tableName === 'devices') {
        cols = entries.map(([k]) => deviceTableMap[k] ?? k).join(', ');
      } else if (tableName === 'users') {
        cols = entries.map(([k]) => userTableMap[k] ?? k).join(', ');
      }

      const placeholders = entries.map(() => '?').join(', ');
      const args = entries.map(([, v]) => v);

      const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders}) RETURNING *`;

      return { sql, args };
    }

    const userDbConfig = procecssDto(userDeviceDto, 'users');
    const deviceDbConfig = procecssDto(deviceDto, 'devices');

    const tx = await this.turso.newTransaction();

    try {
      await tx.execute({
        sql: userDbConfig.sql,
        args: userDbConfig.args as InArgs,
      });

      await tx.execute({
        sql: deviceDbConfig.sql,
        args: deviceDbConfig.args as InArgs,
      });

      await tx.commit();
    } catch (err) {
      try {
        await tx.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed', {
          args: '[REDACTED]',
          error: rollbackErr,
        });
      }

      console.error('Transaction failed', {
        args: '[REDACTED]',
        error: err,
      });

      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateAccount(id: string, dto: UpdateAccountDto) {
    const entries = Object.entries(dto).filter(([, v]) => v !== undefined);
    if (!entries.length) {
      throw new BadRequestException(
        'No account parameters provided to update.',
      );
    }

    const setClauses: string[] = [];
    const args: any[] = [];

    for (const [key, value] of entries) {
      const col = userTableMap[key];
      if (!col) continue;
      setClauses.push(`${col} = ?`);
      args.push(value);
    }

    if (!setClauses.length) {
      throw new BadRequestException(
        'No valid account parameters provided to update.',
      );
    }

    // add id as last arg
    args.push(id);

    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;

    try {
      await this.turso.queryDB(sql, args);
    } catch (err) {
      console.error('Failed to execute update query:', {
        sql,
        args: '[REDACTED]',
        error: err,
      });
      throw new InternalServerErrorException('Failed to update user account.');
    }

    // return the updated user
    try {
      const rows = await this.turso.queryDB(
        'SELECT * FROM users WHERE id = ?',
        [id],
      );
      if (!rows || rows.length === 0) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }

      return { success: true, user: rows[0] };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      console.error('Failed to fetch updated user:', { id, error: err });
      throw new InternalServerErrorException(
        'Failed to retrieve updated user.',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
