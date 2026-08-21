import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, dpop } = request.headers;
    const body = request.body;

    if (!body || typeof body !== 'object') {
      console.log('UN1');
      throw new UnauthorizedException();
    }

    if (
      typeof authorization !== 'string' ||
      typeof dpop !== 'string' ||
      typeof body.deviceId !== 'string' ||
      typeof body.userId !== 'string'
    ) {
      console.log('UN2');
      throw new UnauthorizedException();
    }

    const user = await this.authService.authenticate(
      body.deviceId,
      body.userId,
      authorization,
      dpop,
      request.method,
      `${request.protocol}://${request.get('host')}${request.originalUrl}`,
    );

    request.user = user;

    throw new Error('GOT HERE');
    return true;
  }
}

export { AuthGuard };
