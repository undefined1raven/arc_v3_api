// firebase.provider.ts
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

export const FirebaseProvider = {
  provide: 'FIREBASE_DB',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    if (!getApps().length) {
      const rtdbUrl = config.get<string>('RTDB_URL');
      const base64Sdk = config.get<string>('FIREBASE_SDK');

      if (!base64Sdk) {
        throw new Error(
          '[FirebaseProvider] FIREBASE_SDK is missing from ConfigService!',
        );
      }

      if (!rtdbUrl) {
        throw new Error(
          '[FirebaseProvider] RTDB_URL is missing from ConfigService!',
        );
      }

      try {
        // 1. Decode the Base64 string into a raw JSON string
        const jsonString = Buffer.from(base64Sdk, 'base64').toString('utf-8');

        // 2. Parse the decoded JSON string
        const serviceAccount = JSON.parse(jsonString);

        if (serviceAccount.private_key) {
          serviceAccount.private_key = serviceAccount.private_key.replace(
            /\\n/g,
            '\n',
          );
        }

        initializeApp({
          credential: cert(serviceAccount),
          databaseURL: rtdbUrl,
        });
      } catch (err: any) {
        throw new Error(
          `[FirebaseProvider] Failed to parse SDK or initialize App: ${err.message}`,
        );
      }
    }

    return getDatabase(getApp());
  },
};
