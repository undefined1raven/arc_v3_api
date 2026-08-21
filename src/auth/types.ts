type FirebaseStoredChallangeType = null | {
  challenge: string;
  created_at: number;
};

type FirebaseStoredAuthTokenType = null | {
  token: string;
  created_at: number;
};

export type { FirebaseStoredChallangeType, FirebaseStoredAuthTokenType };
