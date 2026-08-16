import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { TursoDBModule } from './turso/turso.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [FirebaseModule, TursoDBModule, UsersModule, DevicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
