import { FirebaseService } from 'src/firebase/firebase.service';
import { authTokenPath } from '../firebasePaths/authTokenPath';
import { FirebaseStoredAuthTokenType } from '../types';

async function verifyAuthToken(
  firebase: FirebaseService,
  accountId: string,
  deviceId: string,
  authTokenProvided: string,
): Promise<boolean> {
  const tokenPath = authTokenPath(accountId, deviceId);
  const firebaseAuthTokenObj: FirebaseStoredAuthTokenType | null =
    await firebase.get(tokenPath);

  if (firebaseAuthTokenObj === null) {
    return false;
  }

  ///We currently don't have any expiry on auth tokens

  const [scheme, token] = authTokenProvided.split(' ');

  if (scheme !== 'DPoP') {
    return false;
  }

  if (firebaseAuthTokenObj.token !== token) {
    return false;
  }

  return true;
}

export { verifyAuthToken };
