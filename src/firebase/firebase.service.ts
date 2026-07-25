import { Inject, Injectable } from '@nestjs/common';
import type { Database } from 'firebase-admin/database';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_DB')
    private readonly db: Database,
  ) {}

  async get(path: string) {
    const snap = await this.db.ref(path).get();
    return snap.val();
  }

  async set(path: string, value: unknown) {
    await this.db.ref(path).set(value);
  }

  async update(path: string, value: object) {
    await this.db.ref(path).update(value);
  }

  async remove(path: string) {
    await this.db.ref(path).remove();
  }
}
