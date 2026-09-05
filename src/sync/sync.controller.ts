import { Body, Controller, UseGuards, Post, Get } from '@nestjs/common';
import { SyncService } from './sync.service';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { TursoDBService } from 'src/turso/turso.service';
import { SyncPushDto } from './dto/sync-push-dto';

@Controller('sync')
@UseGuards(AuthGuard)
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly turso: TursoDBService,
  ) {}

  @Post('push')
  verifyChallenge(@Body() PushBody: SyncPushDto): Promise<void> {
    return this.syncService.pushMutations(this.turso, PushBody);
  }
}
