import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { TursoDBService } from '../../turso/turso.service';
import { verifyAuthToken } from '../utils/verifyAuthToken';
import { verifyJWTSignature } from '../utils/verifyJWTSignature';
@Injectable()
export class AuthService {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly tursoDB: TursoDBService,
  ) {}

  async authenticate(
    deviceId: string,
    userId: string,
    authorization: string,
    dpop: string,
    method: string,
    url: string,
  ) {
    ///1. Check auth token
    const isAuthTokenValid = await verifyAuthToken(
      this.firebase,
      userId,
      deviceId,
      authorization,
    );

    if (isAuthTokenValid === false) {
      console.log('UN3');
      throw new UnauthorizedException();
    }

    ///2. Check JWT Signature against device public key
    const JWTSignatureVerificationResponse = await verifyJWTSignature(
      this.tursoDB,
      dpop,
      userId,
      deviceId,
    );

    if (JWTSignatureVerificationResponse.status !== 'success') {
      throw new UnauthorizedException();
    }

    ///3. Verify JWT Claims
    const { jwtPayload, jwtHeader } = JWTSignatureVerificationResponse;

    return true;
  }
}
