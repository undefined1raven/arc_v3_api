export function stringToBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}
