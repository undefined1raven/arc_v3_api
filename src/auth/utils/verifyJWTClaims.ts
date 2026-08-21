import { FirebaseService } from 'src/firebase/firebase.service';
import { jtiPath } from '../firebasePaths/jtiPath';
import { JTI_VALIDITY_WINDOW_MS } from '../constants';

type DPoPHeader = {
  typ: 'dpop+jwt';
  alg: 'ES256';
  jwk: {
    kty: 'EC';
    crv: 'P-256';
    x: string;
    y: string;
  };
};

type DPoPPayload = {
  jti: string;
  htm: string;
  htu: string;
  iat: number;
  ath: string;
  nonce?: string;
};

async function verifyJWTClaims(
  firebase: FirebaseService,
  jwtHeader: DPoPHeader,
  jwtPayload: DPoPPayload,
  method: string,
  url: string,
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

  let jtis: { jti: string; created_at: number }[] =
    (await firebase.get(jtiPath)) ?? [];

  if (jtis.some((e) => e.jti === jwtPayload.jti) === true) {
    return false;
  }

  ///Filter expired jtis
  jtis = jtis.filter((e) => Date.now() - e.created_at < JTI_VALIDITY_WINDOW_MS);

  ///Push used jti to the array
  jtis.push({ jti: jwtPayload.jti, created_at: Date.now() });

  ///Save updated JTIs
  await firebase.set(jtiPath, jtis);

  if (jwtPayload.htm !== method.toUpperCase()) {
    return false;
  }

  if (jwtPayload.htu !== url) {
    return false;
  }
}

export { verifyJWTClaims };
