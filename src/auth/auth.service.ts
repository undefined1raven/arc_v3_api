import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { TursoDBService } from '../turso/turso.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly tursoDB: TursoDBService,
  ) {}
}
