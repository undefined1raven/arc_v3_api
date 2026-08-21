const { subtle } = require('crypto').webcrypto;

async function verifyChallengeSignature(
  signature: string,
  publicKeyJwk: string,
  plainChallenge: string,
): Promise<boolean> {
  if (
    typeof signature !== 'string' ||
    typeof publicKeyJwk !== 'string' ||
    typeof plainChallenge !== 'string'
  ) {
    return false;
  }
  try {
    const publicKey = await subtle.importKey(
      'jwk',
      JSON.parse(publicKeyJwk),
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      false,
      ['verify'],
    );

    const isValid = await subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256',
      },
      publicKey,
      Buffer.from(signature, 'base64url'),
      new TextEncoder().encode(plainChallenge),
    );

    if (!isValid) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    return false;
  }
}

export { verifyChallengeSignature };
