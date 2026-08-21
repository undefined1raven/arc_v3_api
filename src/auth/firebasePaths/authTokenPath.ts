import { stringToBase64Url } from 'src/utils/strToBase64url';

function authTokenPath(accountIdStr: string, deviceIdStr: string) {
  return `/auth/tokens/${stringToBase64Url(accountIdStr)}/${stringToBase64Url(deviceIdStr)}`;
}

export { authTokenPath };
