type FirebaseStoredChallangeType = null | {
  challenge: string;
  created_at: number;
};

type FirebaseStoredAuthTokenType = null | {
  token: string;
  created_at: number;
};

type DPoPHeader = {
  typ: 'dpop+jwt';
  alg: 'ES256';
  jwk: {
    kty: 'EC';
    crv: 'P-256';
    x: string;
    y: string;
  };
};

type DPoPPayload = {
  jti: string;
  htm: string;
  htu: string;
  iat: number;
  ath: string;
  nonce?: string;
};

export type {
  FirebaseStoredChallangeType,
  FirebaseStoredAuthTokenType,
  DPoPHeader,
  DPoPPayload,
};
