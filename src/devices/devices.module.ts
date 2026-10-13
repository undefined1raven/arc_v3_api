import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TursoDBModule } from 'src/turso/turso.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  imports: [TursoDBModule, FirebaseModule],
  controllers: [DevicesController],
  providers: [DevicesService, AuthService],
})
export class DevicesModule {}
