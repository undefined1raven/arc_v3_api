import { Module } from '@nestjs/common';
import { TursoDBModule } from '../turso/turso.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthGuard } from './guards/auth-guard';

@Module({
  imports: [FirebaseModule, TursoDBModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
