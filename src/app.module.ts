import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { TursoDBModule } from './turso/turso.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    FirebaseModule,
    TursoDBModule,
    UsersModule,
    DevicesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
