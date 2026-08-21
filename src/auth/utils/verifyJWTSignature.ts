import { JWK, jwtVerify } from 'jose';
import { TursoDBService } from 'src/turso/turso.service';

async function verifyJWTSignature(
  turso: TursoDBService,
  dpop: string,
  userId: string,
  deviceId: string,
): Promise<
  | { status: 'success'; jwtPayload: object; jwtHeader: object }
  | { status: 'error'; error: string }
> {
  const publicKeyResponse = await turso.queryDB(
    `SELECT device_public_key FROM devices WHERE account_id = ? AND device_id = ?`,
    [userId, deviceId],
  );
  const deviceDataRow = publicKeyResponse[0];

  if (!deviceDataRow || typeof deviceDataRow?.device_public_key !== 'string') {
    return { status: 'error', error: 'Failed to get device public key' };
  }
  const publicKeyJwkStr = deviceDataRow?.device_public_key;

  let publicKeyJwk: null | JWK = null;

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
