import { Module } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseProvider, FirebaseService],
  exports: [FirebaseService, 'FIREBASE_DB'],
})
export class FirebaseModule {}
