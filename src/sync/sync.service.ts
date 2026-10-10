import { Injectable } from '@nestjs/common';
import { MutationDto, SyncPullDto, SyncPushDto } from './dto/sync-push-dto';
import { TursoDBService } from 'src/turso/turso.service';
import { validateMutationsForFeature } from './utils/getCanonicalHashForMutatedChunksInFeature';
import { commitMutations } from './utils/commitMutations';
import { getLastCursosrForAlreadyCommitedMutations } from './utils/getLastCursorForAlreadyCommitedMutations';
import getLastCursorForUser from './utils/getLastCursorForUser';

export type Feature =
  | 'timeTrackingChunks'
  | 'dayPlannerChunks'
  | 'featureConfigChunks'
  | 'personalDiaryChunks'
  | 'personalDiaryGroups';

export type CommitResultsWithoutCursor = {
  success: boolean;
  commited: MutationDto[];
  conflicts: MutationDto[];
};

@Injectable()
export class SyncService {
  constructor(private readonly tursoDB: TursoDBService) {}

  async pushMutations(syncPushObj: SyncPushDto): Promise<any> {
    const features = [
      'timeTrackingChunks',
      'dayPlannerChunks',
      'featureConfigChunks',
      'personalDiaryChunks',
      'personalDiaryGroups',
    ];

    const forcePush = syncPushObj.forcePush;

    const validationResults = await Promise.all(
      features.map((feature) =>
        validateMutationsForFeature(
          feature as Feature,
          syncPushObj.userId,
          this.tursoDB,
          syncPushObj.mutations,
          syncPushObj.forcePush,
        ),
      ),
    );

    const alreadyCommitedMutations: CommitResultsWithoutCursor[] = [];

    const commitPromises = features.map((feature, index) => {
      const featureMutations = validationResults[index];
      const validMutationsWithInsert: {
        insert: boolean;
        mutation: MutationDto;
      }[] = featureMutations
        .filter(
          (result) =>
            result.valid &&
            (forcePush ? true : result.alreadyCommited === false),
        )
        .map((result) => {
          return { mutation: result.mutation, insert: result.insert };
        });

      const alreadyCommitedFeatureMutations = featureMutations.filter(
        (m) => m.alreadyCommited === true,
      );

      alreadyCommitedMutations.push({
        commited: alreadyCommitedFeatureMutations.map((m) => m.mutation),
        success: true,
        conflicts: [],
      });

      return commitMutations(
        validMutationsWithInsert,
        this.tursoDB,
        syncPushObj.userId,
        feature as Feature,
      );
    });

    const commitResults = await Promise.all(commitPromises);

    const commitResultsWithoutCursor = commitResults.map((r) => {
      delete r.last_cursor;
      return r;
    });

    const lastCursor = await getLastCursorForUser(
      syncPushObj.userId,
      this.tursoDB,
    );

    return {
      commitResults: [
        ...commitResultsWithoutCursor,
        ...alreadyCommitedMutations,
      ],
      lastCursor,
    };
  }

  async pullMutations(pullBody: SyncPullDto) {
    const mutationsToApply = await this.tursoDB.queryDB(
      `SELECT * FROM sync_ops WHERE user_id = ? AND id > ?`,
      [pullBody.userId, pullBody.lastCursor],
    );
    console.log('mutationsToApply', mutationsToApply);

    const relevantMutations = mutationsToApply as unknown as MutationDto[];
    const chunkMap: Record<string, MutationDto> = {};

    relevantMutations.map((mutation: MutationDto) => {
      const chunkId = mutation.chunk_id;
      chunkMap[chunkId] = mutation;
    });

    console.log('chunkMap', chunkMap);

    return chunkMap;
  }
}
