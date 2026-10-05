import { Injectable } from '@nestjs/common';
import { MutationDto, SyncPushDto } from './dto/sync-push-dto';
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
  async pushMutations(
    turso: TursoDBService,
    syncPushObj: SyncPushDto,
  ): Promise<any> {
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
          turso,
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
        turso,
        syncPushObj.userId,
        feature as Feature,
      );
    });

    const commitResults = await Promise.all(commitPromises);

    const commitResultsWithoutCursor = commitResults.map((r) => {
      delete r.last_cursor;
      return r;
    });

    const lastCursor = await getLastCursorForUser(syncPushObj.userId, turso);

    return {
      commitResults: [
        ...commitResultsWithoutCursor,
        ...alreadyCommitedMutations,
      ],
      lastCursor,
    };
  }
}
