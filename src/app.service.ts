import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';

@Injectable()
export class AppService {
  constructor(private readonly firebase: FirebaseService) {}
  async getHello(): Promise<string> {
    return new Promise((res, rej) => {
      res('Hello world');
    });
  }
}
