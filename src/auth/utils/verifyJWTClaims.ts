import { FirebaseService } from 'src/firebase/firebase.service';
import { jtiPath } from '../firebasePaths/jtiPath';
import {
  DPOP_IAT_VALIDITY_WINDOW_S,
  JTI_VALIDITY_WINDOW_MS,
} from '../constants';
import { cleanupExpiredJtis } from './outOfRotationJTICleanup';
import { DPoPHeader, DPoPPayload } from '../types';
import { hashAccessToken } from './hashAuthToken';

async function verifyJWTClaims(
  firebase: FirebaseService,
  jwtHeader: DPoPHeader,
  jwtPayload: DPoPPayload,
  method: string,
  url: string,
  authToken: string,
) {
  if (jwtHeader.typ !== 'dpop+jwt') {
    return false;
  }
  if (jwtHeader.alg !== 'ES256') {
    return false;
  }

  if (typeof jwtPayload.jti !== 'string') {
    return false;
  }

  const jtiResult = await firebase.transaction<{
    expires_at: number;
  }>(`${jtiPath}/${jwtPayload.jti}`, (current) => {
    if (current !== null) {
      return null; // Abort: JTI already exists
    }

    return {
      expires_at: Date.now() + JTI_VALIDITY_WINDOW_MS,
    };
  });

  if (!jtiResult.committed) {
    return false;
  }

  if (Math.random() < 0.2) {
    void cleanupExpiredJtis(firebase).catch((error) => {
      console.error('Failed to clean up expired JTIs:', error);
    });
  }

  if (jwtPayload.htm !== method.toUpperCase()) {
    return false;
  }

  if (jwtPayload.htu !== url) {
    return false;
  }

  const now_S = Math.floor(Date.now() / 1000);

  if (now_S - jwtPayload.iat > DPOP_IAT_VALIDITY_WINDOW_S) {
    return false;
  }

  if (typeof jwtPayload.ath !== 'string' || typeof authToken !== 'string') {
    return false;
  }

  const hashedAuthToken = await hashAccessToken(authToken);

  if (hashedAuthToken !== jwtPayload.ath) {
    return;
  }

  return true;
}

export { verifyJWTClaims };
