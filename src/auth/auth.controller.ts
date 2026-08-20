import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sessionService } from './services/sessionService';
import { createChallengeService } from './services/createChallengeService';
import { FirebaseService } from 'src/firebase/firebase.service';
import { TursoDBService } from 'src/turso/turso.service';
import { CreateChallengeDto } from './dto/create-challenge-dto';
import { verifyChallengeService } from './services/verifyChallengeService';
import { VerifyChallengeDto } from './dto/verify-challenge-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebaseService: FirebaseService,
    private readonly turso: TursoDBService,
  ) {}

  @Get('session')
  getSessionInfo() {
    return sessionService();
  }

  @Post('createChallenge')
  createChallenge(@Body() updateAccountDto: CreateChallengeDto) {
    return createChallengeService(
      this.firebaseService,
      this.turso,
      updateAccountDto,
    );
  }

  @Post('verifyChallenge')
  verifyChallenge(@Body() VerifyChallengeDto: VerifyChallengeDto) {
    return verifyChallengeService(
      this.firebaseService,
      this.turso,
      VerifyChallengeDto,
    );
  }
}
