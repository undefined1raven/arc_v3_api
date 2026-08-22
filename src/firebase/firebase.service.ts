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

  async transaction<T>(
    path: string,
    updateFn: (currentValue: T | null) => T | null,
    options?: { applyLocally?: boolean },
  ) {
    return this.db.ref(path).transaction(updateFn, undefined, options);
  }

  async query(
    path: string,
    orderByChild: string,
    options?: {
      startAt?: number | string | boolean;
      endAt?: number | string | boolean;
      equalTo?: number | string | boolean;
      limitToFirst?: number;
      limitToLast?: number;
    },
  ) {
    let query = this.db.ref(path).orderByChild(orderByChild);

    if (options?.startAt !== undefined) {
      query = query.startAt(options.startAt);
    }

    if (options?.endAt !== undefined) {
      query = query.endAt(options.endAt);
    }

    if (options?.equalTo !== undefined) {
      query = query.equalTo(options.equalTo);
    }

    if (options?.limitToFirst !== undefined) {
      query = query.limitToFirst(options.limitToFirst);
    }

    if (options?.limitToLast !== undefined) {
      query = query.limitToLast(options.limitToLast);
    }

    return query.get();
  }
}
