import { FirebaseService } from 'src/firebase/firebase.service';
import { TursoDBService } from 'src/turso/turso.service';
import { UnauthorizedException } from '@nestjs/common';
import { VerifyChallengeDto } from '../dto/verify-challenge-dto';
import { FirebaseStoredChallangeType } from '../types';
import { AUTH_CHALLENGE_EXPIRATION } from '../constants';
import { verifyChallengeSignature } from '../utils/verifyChallengeSignature';
import { generateAuthToken } from 'src/utils/generateAuthToken';
import { firebaseChallengePath } from '../firebasePaths/challengePath';
import { authTokenPath } from '../firebasePaths/authTokenPath';

type DeviceKeyResult = {
  device_public_key: string;
  device_id: string;
  account_id: string;
};

async function verifyChallengeService(
  firebaseProvider: FirebaseService,
  tursoProvider: TursoDBService,
  verifyChallengeDto: VerifyChallengeDto,
) {
  const { deviceId, accountId, signedChallenge, plainChallenge } =
    verifyChallengeDto;
  const firebaseChallengePathToCheck = firebaseChallengePath(
    accountId,
    deviceId,
  );

  const storedChallengeObj: FirebaseStoredChallangeType =
    await firebaseProvider.get(firebaseChallengePathToCheck);

  ///Check if challenge exists
  if (storedChallengeObj === null) {
    throw new UnauthorizedException('Verification failed');
  }

  if (
    typeof storedChallengeObj.challenge !== 'string' ||
    typeof storedChallengeObj.created_at !== 'number'
  ) {
    throw new UnauthorizedException('Verification failed');
  }

  if (storedChallengeObj.challenge !== plainChallenge) {
    throw new UnauthorizedException('Verification failed');
  }

  const createdAtDelta = Date.now() - storedChallengeObj.created_at;

  ///Check if challenge is expired
  if (createdAtDelta >= AUTH_CHALLENGE_EXPIRATION) {
    throw new UnauthorizedException('Verification failed');
  }

  ///Get device public key to check sig
  const dbResponse = await tursoProvider.queryDB(
    `SELECT device_public_key, device_id, account_id
   FROM devices
   WHERE device_id = ?
     AND account_id = ?`,
    [deviceId, accountId],
  );

  //@ts-ignore
  const deviceObj = dbResponse[0] as DeviceKeyResult | undefined;

  if (
    !deviceObj?.device_public_key ||
    !deviceObj?.device_id ||
    !deviceObj?.account_id
  ) {
    throw new UnauthorizedException('Verification failed');
  }

  const devicePublicKey = deviceObj.device_public_key;

  ///Verify signature
  const isSignatureReal = await verifyChallengeSignature(
    signedChallenge,
    devicePublicKey,
    plainChallenge,
  );

  if (isSignatureReal === false) {
    throw new UnauthorizedException('Verification failed');
  }
  ///Generate and store new auth token
  const newAuthToken = generateAuthToken();
  const firebaseTokenStoragePath = authTokenPath(
    deviceObj.account_id,
    deviceObj.device_id,
  );
  const payload = { token: newAuthToken, created_at: Date.now() };
  await firebaseProvider.set(firebaseTokenStoragePath, payload);
  await firebaseProvider.remove(firebaseChallengePathToCheck);
  return { token: newAuthToken };
}

export { verifyChallengeService };
