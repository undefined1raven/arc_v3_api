import { Injectable } from '@nestjs/common';
import { SyncPushDto } from './dto/sync-push-dto';
import { TursoDBService } from 'src/turso/turso.service';

@Injectable()
export class SyncService {
  async pushMutations(
    turso: TursoDBService,
    mutations: SyncPushDto,
  ): Promise<any> {
    return { success: true, mutations: mutations };
  }
}
