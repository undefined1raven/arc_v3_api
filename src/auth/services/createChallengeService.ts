import { generateChallenge } from 'src/utils/generateAuthChallenge';
import { CreateChallengeDto } from '../dto/create-challenge-dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { TursoDBService } from 'src/turso/turso.service';
import { UnauthorizedException } from '@nestjs/common';
import { firebaseChallengePath } from '../firebasePaths/challengePath';

async function createChallengeService(
  firebaseProvider: FirebaseService,
  tursoProvider: TursoDBService,
  createChallengeDto: CreateChallengeDto,
) {
  const { deviceId, accountId } = createChallengeDto;

  const dbResponse = await tursoProvider.queryDB(
    `SELECT device_public_key, account_id, device_id FROM devices WHERE device_id = ? `,
    [deviceId],
  );
  const deviceObj = dbResponse[0];

  if (
    !deviceObj?.device_public_key ||
    !deviceObj?.account_id ||
    !deviceObj?.device_id
  ) {
    throw new UnauthorizedException('Invalid device');
  }

  if (accountId !== deviceObj?.account_id) {
    throw new UnauthorizedException('Invalid device');
  }

  if (typeof deviceObj?.device_id !== 'string') {
    throw new UnauthorizedException('Invalid device');
  }

  const newChallenge = generateChallenge();
  const firebasePayload = { challenge: newChallenge, created_at: Date.now() };
  const firebasePath = firebaseChallengePath(
    deviceObj.account_id,
    deviceObj.device_id,
  );
  await firebaseProvider.set(firebasePath, firebasePayload);

  return { challenge: newChallenge };
}

export { createChallengeService };
