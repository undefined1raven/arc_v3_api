import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TursoDBModule } from 'src/turso/turso.module';

@Module({
  controllers: [SyncController],
  providers: [SyncService],
  imports: [AuthModule, TursoDBModule],
})
export class SyncModule {}
