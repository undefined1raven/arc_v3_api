import { Injectable } from '@nestjs/common';
import { MutationDto, SyncPushDto } from './dto/sync-push-dto';
import { TursoDBService } from 'src/turso/turso.service';
import { validateMutationsForFeature } from './utils/getCanonicalHashForMutatedChunksInFeature';
import { commitMutations } from './utils/commitMutations';

export type Feature =
  | 'timeTrackingChunks'
  | 'dayPlannerChunks'
  | 'featureConfigChunks'
  | 'personalDiaryChunks'
  | 'personalDiaryGroups';

@Injectable()
export class SyncService {
  async pushMutations(
    turso: TursoDBService,
    mutations: SyncPushDto,
  ): Promise<any> {
    const features = [
      'timeTrackingChunks',
      'dayPlannerChunks',
      'featureConfigChunks',
      'personalDiaryChunks',
      'personalDiaryGroups',
    ];

    const validationResults = await Promise.all(
      features.map((feature) =>
        validateMutationsForFeature(
          feature as Feature,
          mutations.userId,
          turso,
          mutations.mutations,
        ),
      ),
    );

    const commitPromises = features.map((feature, index) => {
      const featureMutations = validationResults[index];
      const validMutationsWithInsert: {
        insert: boolean;
        mutation: MutationDto;
      }[] = featureMutations
        .filter((result) => result.valid)
        .map((result) => {
          return { mutation: result.mutation, insert: result.insert };
        });
      return commitMutations(
        validMutationsWithInsert,
        turso,
        mutations.userId,
        feature as Feature,
      );
    });

    const commitResults = await Promise.all(commitPromises);

    console.log('commitResults:', commitResults);

    return { success: true, mutations: mutations };
  }
}
