import { stringToBase64Url } from 'src/utils/strToBase64url';

function firebaseChallengePath(accountIdStr: string, deviceIdStr: string) {
  return `/auth/challenges/${stringToBase64Url(accountIdStr)}/${stringToBase64Url(deviceIdStr)}`;
}

export { firebaseChallengePath };
