import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TursoDBModule } from '../turso/turso.module';

@Module({
  imports: [TursoDBModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
