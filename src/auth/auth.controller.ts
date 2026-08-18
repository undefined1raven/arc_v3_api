import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sessionService } from './services/sessionService';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  getSessionInfo() {
    return sessionService();
  }
}
