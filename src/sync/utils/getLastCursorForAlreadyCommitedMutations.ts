import { TursoDBService } from 'src/turso/turso.service';
import { CommitResultsWithoutCursor } from '../sync.service';

async function getLastCursosrForAlreadyCommitedMutations(
  alreadyCommtied: CommitResultsWithoutCursor[],
  turso: TursoDBService,
  userId: string,
) {
  if (alreadyCommtied.length === 0) {
    return null;
  }

  const mutationIds = alreadyCommtied
    .flatMap((x) => x.commited)
    .map((r) => r.mutation_id);

  if (mutationIds.length === 0) {
    return null;
  }

  const placeholders = mutationIds.map(() => '?').join(', ');

  const result = await turso.queryDB(
    `
    SELECT MAX(id) AS last_cursor
    FROM sync_ops
    WHERE user_id = ?
      AND mutation_id IN (${placeholders})
  `,
    [userId, ...mutationIds],
  );

  const cursor = result?.[0]?.last_cursor;

  return typeof cursor === 'number' ? cursor : null;
}

export { getLastCursosrForAlreadyCommitedMutations };
