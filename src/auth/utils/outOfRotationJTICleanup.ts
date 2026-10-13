import { FirebaseService } from 'src/firebase/firebase.service';
import { jtiPath } from '../firebasePaths/jtiPath';

async function cleanupExpiredJtis(firebase: FirebaseService) {
  const snapshot = await firebase.query(jtiPath, 'expires_at', {
    endAt: Date.now(),
  });

  if (!snapshot.exists()) {
    return;
  }

  const updates: Record<string, null> = {};

  snapshot.forEach((child) => {
    if (child.key) {
      updates[child.key] = null;
    }

    return false;
  });

  if (Object.keys(updates).length > 0) {
    await firebase.update(jtiPath, updates);
  }
}

export { cleanupExpiredJtis };
