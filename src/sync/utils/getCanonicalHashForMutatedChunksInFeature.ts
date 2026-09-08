import { TursoDBService } from 'src/turso/turso.service';
import { SyncPushDto } from '../dto/sync-push-dto';
import { Feature } from '../sync.service';

export async function validateMutationsForFeature(
  feature: Feature,
  userId: string,
  turso: TursoDBService,
  mutations: SyncPushDto['mutations'],
) {
  const relevantMutations = mutations.filter(
    (mutation) => mutation.feature === feature,
  );

  if (relevantMutations.length === 0) {
    return [];
  }

  const chunkIds = relevantMutations.map((mutation) => mutation.chunk_id);

  const placeholders = chunkIds.map(() => '?').join(', ');

  const canonicalHashes = await turso.queryDB(
    `SELECT hash, id
      FROM ${feature}
      WHERE userID = ?
        AND id IN (${placeholders})`,
    [userId, ...chunkIds],
  );

  const canonicalHashMap = new Map(
    canonicalHashes.map((row) => [row.id, row.hash]),
  );

  const validationResults = relevantMutations.map((mutation) => {
    const canonicalHash = canonicalHashMap.get(mutation.chunk_id);

    if (canonicalHash === undefined) {
      return {
        mutation,
        valid: true,
        insert: true, ///Tell the commit fn to INSERT the chunk
      };
    }

    const valid = canonicalHash === mutation.base_hash;

    return {
      mutation,
      valid,
      insert: false,
    };
  });

  return validationResults;
}
