import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { TursoDBModule } from './turso/turso.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { AuthModule } from './auth/auth.module';
import { SyncModule } from './sync/sync.module';
import { RequestLoggerMiddleware } from './request-logger.middleware';

@Module({
  imports: [
    FirebaseModule,
    TursoDBModule,
    UsersModule,
    DevicesModule,
    AuthModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
