import { randomBytes } from 'node:crypto';

export function generateChallenge(): string {
  //@ts-ignore
  //This is valid sync random bytes without the callback req for the async version
  return randomBytes(32).toString('base64url');
}
