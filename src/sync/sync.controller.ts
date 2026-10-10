import { Body, Controller, UseGuards, Post, Get } from '@nestjs/common';
import { SyncService } from './sync.service';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { TursoDBService } from 'src/turso/turso.service';
import { SyncPushDto, SyncPullDto, MutationDto } from './dto/sync-push-dto';
import { Row } from '@libsql/client';

@Controller('sync')
@UseGuards(AuthGuard)
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly turso: TursoDBService,
  ) {}

  @Post('push')
  pushMutations(@Body() PushBody: SyncPushDto): Promise<void> {
    return this.syncService.pushMutations(PushBody);
  }

  @Post('pull')
  pullMutations(
    @Body() PullBody: SyncPullDto,
  ): Promise<Record<string, MutationDto>> {
    return this.syncService.pullMutations(PullBody);
  }
}
