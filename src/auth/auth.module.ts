import { Module } from '@nestjs/common';
import { TursoDBModule } from '../turso/turso.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [TursoDBModule, FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
