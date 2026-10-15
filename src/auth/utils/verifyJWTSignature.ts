import { TursoDBService } from 'src/turso/turso.service';
import { DPoPHeader, DPoPPayload } from '../types';

async function verifyJWTSignature(
  turso: TursoDBService,
  dpop: string,
  userId: string,
  deviceId: string,
): Promise<
  | {
      status: 'success';
      jwtPayload: DPoPPayload;
      jwtHeader: DPoPHeader;
    }
  | { status: 'error'; error: string }
> {
  const { jwtVerify } = await import('jose');
  const publicKeyResponse = await turso.queryDB(
    `SELECT device_public_key FROM devices WHERE account_id = ? AND device_id = ?`,
    [userId, deviceId],
  );
  const deviceDataRow = publicKeyResponse[0];

  if (!deviceDataRow || typeof deviceDataRow?.device_public_key !== 'string') {
    return { status: 'error', error: 'Failed to get device public key' };
  }
  const publicKeyJwkStr = deviceDataRow?.device_public_key;

  let publicKeyJwk: any = null;

  try {
    publicKeyJwk = JSON.parse(publicKeyJwkStr);
  } catch (e) {
    return { status: 'error', error: 'Failed to parse device public key' };
  }

  //@ts-ignore
  return jwtVerify(dpop, publicKeyJwk, { algorithms: ['ES256'] })
    .then((res) => {
      return {
        status: 'success',
        jwtPayload: res.payload,
        jwtHeader: res.protectedHeader,
      };
    })
    .catch((e) => {
      return { status: 'error', error: e };
    });
}

export { verifyJWTSignature };
