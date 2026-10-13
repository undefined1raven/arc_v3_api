import { randomBytes } from 'node:crypto';

export function generateAuthToken(): string {
  //@ts-ignore
  //This is valid sync random bytes without the callback req for the async version
  return randomBytes(64).toString('base64url');
}
