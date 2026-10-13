import { MutationDto } from '../dto/sync-push-dto';

type ChunkTypes =
  | 'timeTrackingChunks'
  | 'dayPlannerChunks'
  | 'featureConfigChunks'
  | 'personalDiaryChunks'
  | 'personalDiaryGroups';

const featureConfig: Record<
  ChunkTypes,
  {
    insertColumns: string;
    insertArgs: (mutation: MutationDto, userId: string) => unknown[];
    updateSet: string;
    updateArgs: (mutation: MutationDto) => unknown[];
  }
> = {
  timeTrackingChunks: {
    insertColumns: `
      userID, id, encryptedContent, hash, tx,
      timeRangeStart, timeRangeEnd, version
    `,
    insertArgs: (m, userId) => [
      userId,
      m.chunk_id,
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.time_range_start,
      m.time_range_end,
      m.version,
    ],
    updateSet: `
      encryptedContent = ?,
      hash = ?,
      tx = ?,
      timeRangeStart = ?,
      timeRangeEnd = ?
    `,
    updateArgs: (m) => [
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.time_range_start,
      m.time_range_end,
    ],
  },

  dayPlannerChunks: {
    insertColumns: `
      userID, id, encryptedContent, hash, tx,
      timeRangeStart, timeRangeEnd, version
    `,
    insertArgs: (m, userId) => [
      userId,
      m.chunk_id,
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.time_range_start,
      m.time_range_end,
      m.version,
    ],
    updateSet: `
      encryptedContent = ?,
      hash = ?,
      tx = ?,
      timeRangeStart = ?,
      timeRangeEnd = ?
    `,
    updateArgs: (m) => [
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.time_range_start,
      m.time_range_end,
    ],
  },

  featureConfigChunks: {
    insertColumns: `
      userID, id, encryptedContent, hash, tx, type, version
    `,
    insertArgs: (m, userId) => [
      userId,
      m.chunk_id,
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.type,
      m.version,
    ],
    updateSet: `
      encryptedContent = ?,
      hash = ?,
      tx = ?,
      type = ?
    `,
    updateArgs: (m) => [m.encrypted_content, m.hash, m.updated_at, m.type],
  },

  personalDiaryChunks: {
    insertColumns: `
      userID, id, encryptedContent, hash, tx, version
    `,
    insertArgs: (m, userId) => [
      userId,
      m.chunk_id,
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.version,
    ],
    updateSet: `
      encryptedContent = ?,
      hash = ?,
      tx = ?
    `,
    updateArgs: (m) => [m.encrypted_content, m.hash, m.updated_at],
  },

  personalDiaryGroups: {
    insertColumns: `
      userID, id, encryptedContent, hash, tx, version
    `,
    insertArgs: (m, userId) => [
      userId,
      m.chunk_id,
      m.encrypted_content,
      m.hash,
      m.updated_at,
      m.version,
    ],
    updateSet: `
      encryptedContent = ?,
      hash = ?,
      tx = ?
    `,
    updateArgs: (m) => [m.encrypted_content, m.hash, m.updated_at],
  },
};

export { featureConfig };
