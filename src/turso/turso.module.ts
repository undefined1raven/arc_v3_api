import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TursoDBProvider } from './turso.provider';
import { TursoDBService } from './turso.service';

@Module({
  imports: [ConfigModule],
  providers: [TursoDBProvider, TursoDBService],
  exports: [TursoDBService],
})
export class TursoDBModule {}
