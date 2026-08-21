import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TursoDBModule } from '../turso/turso.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TursoDBModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
