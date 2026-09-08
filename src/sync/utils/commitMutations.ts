import { TursoDBService } from 'src/turso/turso.service';
import { MutationDto, SyncPushDto } from '../dto/sync-push-dto';
import { Feature } from '../sync.service';
import { featureConfig } from './featureCommitHelper';
import { InArgs } from '@libsql/client';

async function commitMutations(
  validMutationsWithInsert: {
    mutation: MutationDto;
    insert: boolean;
  }[],
  turso: TursoDBService,
  userId: string,
  feature: Feature,
) {
  const tx = await turso.newTransaction();
  const conflicts: SyncPushDto['mutations'] = [];
  const commits: SyncPushDto['mutations'] = [];

  const mutationHelper = featureConfig[feature];
  try {
    for (const mutationWithInsert of validMutationsWithInsert) {
      const mutation = mutationWithInsert.mutation;
      const insertNewChunk = mutationWithInsert.insert;

      console.log('HASHES', mutation.base_hash, mutation.hash, insertNewChunk);

      if (insertNewChunk) {
        ///If the base_hash is missing it means the chunk is new and should be inserted

        const result = await tx.execute({
          sql: `
          INSERT INTO ${feature}
            (${mutationHelper.insertColumns})
          VALUES (${mutationHelper
            .insertArgs(mutation, userId)
            .map(() => '?')
            .join(', ')})
        `,
          args: mutationHelper.insertArgs(mutation, userId) as InArgs,
        });
        console.log('RRW', result);
        if (result.rowsAffected === 1) {
          commits.push(mutation);
        } else {
          conflicts.push(mutation);
        }
      } else {
        ///If the base_hash is present it means the chunk already exists and should be updated if the hash matches
        const result = await tx.execute({
          sql: `
          UPDATE ${feature}
          SET
            ${mutationHelper.updateSet}
          WHERE
            userID = ?
            AND id = ?
            AND hash = ?
        `,
          args: [
            ...mutationHelper.updateArgs(mutation),
            userId,
            mutation.chunk_id,
            mutation.base_hash,
          ] as InArgs,
        });

        console.log('LLW', result);

        if (result.rowsAffected === 1) {
          commits.push(mutation);
          continue;
        }

        // No row was updated. It is either a missing chunk
        // or the hash changed since the client read it.
        const existing = await tx.execute({
          sql: `
          SELECT id
          FROM ${feature}
          WHERE userID = ?
            AND id = ?
        `,
          args: [userId, mutation.chunk_id],
        });

        if (existing.rows.length > 0) {
          conflicts.push(mutation);
          continue;
        }
      }
    }

    await tx.commit();

    return {
      success: conflicts.length === 0,
      committed: commits,
      conflicts: conflicts,
    };
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
  }
}

export { commitMutations };
