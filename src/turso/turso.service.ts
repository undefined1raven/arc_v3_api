import type { Client, InArgs } from '@libsql/client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TursoDBService {
  constructor(
    @Inject('TURSO_DB')
    private readonly db: Client,
  ) {}

  async queryDB(sql: string, args?: InArgs | undefined) {
    if (!sql.trim()) {
      throw new Error('SQL query cannot be empty.');
    }

    try {
      const { rows } = await this.db.execute({
        sql,
        args,
      });

      return rows;
    } catch (err) {
      console.error('Database query failed:', {
        sql,
        args: '[REDACTED]',
        error: err,
      });

      throw err;
    }
  }
}
