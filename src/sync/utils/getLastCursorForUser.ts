import { TursoDBService } from 'src/turso/turso.service';

async function getLastCursorForUser(
  userId: string,
  turso: TursoDBService,
): Promise<number | null> {
  if (typeof userId !== 'string') {
    throw new Error('userId must be a string');
  }
  const cursorResult = await turso.queryDB(
    `SELECT COALESCE(MAX(id), 0) AS last_cursor
    FROM sync_ops
    WHERE user_id = ?`,
    [userId],
  );

  if (cursorResult.length === 0) {
    return null;
  }

  return cursorResult[0].last_cursor as number;
}

export default getLastCursorForUser;
