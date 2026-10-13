const { subtle } = require('crypto').webcrypto;
async function hashAccessToken(accessToken: string) {
  const digest = await subtle.digest(
    'SHA-256',
    new TextEncoder().encode(accessToken),
  );

  return Buffer.from(digest).toString('base64url');
}

export { hashAccessToken };
