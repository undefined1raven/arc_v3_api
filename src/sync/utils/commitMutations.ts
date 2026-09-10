import { TursoDBService } from 'src/turso/turso.service';
import { MutationDto, SyncPushDto } from '../dto/sync-push-dto';
import { Feature } from '../sync.service';
import { featureConfig } from './featureCommitHelper';
import { InArgs, Transaction } from '@libsql/client';

async function logCommitInSyncOpsTable(tx: Transaction, mutation: MutationDto) {
  return await tx.execute({
    sql: `INSERT INTO sync_ops (mutation_id, chunk_id, user_id, encrypted_content, tx, time_range_end, hash) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      mutation.mutation_id,
      mutation.chunk_id,
      mutation.account_id,
      mutation.encrypted_content,
      mutation.updated_at,
      mutation.time_range_end ?? null,
      mutation.hash,
    ],
  });
}

async function commitMutations(
  validMutationsWithInsert: {
    mutation: MutationDto;
    insert: boolean;
  }[],
  turso: TursoDBService,
  userId: string,
  feature: Feature,
): Promise<{
  success: boolean;
  commited: MutationDto[];
  conflicts: MutationDto[];
  last_cursor?: number | null;
}> {
  const tx = await turso.newTransaction();
  const conflicts: SyncPushDto['mutations'] = [];
  const commits: SyncPushDto['mutations'] = [];
  let last_cursor: null | number = null;
  const mutationHelper = featureConfig[feature];

  try {
    for (const mutationWithInsert of validMutationsWithInsert) {
      const mutation = mutationWithInsert.mutation;
      const insertNewChunk = mutationWithInsert.insert;

      if (insertNewChunk) {
        ///Insert the new canonical chunk
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
        if (result.rowsAffected === 1) {
          ///Log the commit in the sync_ops table
          const logCommitRes = await logCommitInSyncOpsTable(tx, mutation);
          if (logCommitRes.rowsAffected !== 1) {
            console.error(
              'Failed to add mutation to commit log. Rolling back.',
            );
            throw new Error(
              'Failed to add mutation to commit log. Rolling back. [X-1]',
            );
          }

          commits.push(mutation);
          last_cursor = Number(logCommitRes.lastInsertRowid);
          continue;
        } else {
          conflicts.push(mutation);
        }
      } else {
        ///Update the canonical chunk
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

        if (result.rowsAffected === 1) {
          ///Log the commit in the sync_ops table
          const logCommitRes = await logCommitInSyncOpsTable(tx, mutation);

          if (logCommitRes.rowsAffected !== 1) {
            console.error(
              'Failed to add mutation to commit log. Rolling back.',
            );
            throw new Error(
              'Failed to add mutation to commit log. Rolling back. [X-2]',
            );
          }

          commits.push(mutation);
          last_cursor = Number(logCommitRes.lastInsertRowid);
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
      commited: commits,
      conflicts: conflicts,
      last_cursor: last_cursor,
    };
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
  }
}

export { commitMutations };
