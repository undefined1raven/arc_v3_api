import { ConfigService } from '@nestjs/config';
import { createClient } from '@libsql/client';

export const TursoDBProvider = {
  provide: 'TURSO_DB',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const TURSO_URL = process.env.TURSO_URL;
    const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

    if (typeof TURSO_URL !== 'string') {
      throw new Error('[Turso Provider] Turso URL Missing');
    }
    if (typeof TURSO_AUTH_TOKEN !== 'string') {
      throw new Error('[Turso Provider] Turso Auth Token Missing');
    }

    const tursoConfig = { url: TURSO_URL, authToken: TURSO_AUTH_TOKEN };
    const tursoDB = createClient(tursoConfig);
    return tursoDB;
  },
};
