import { format } from 'date-fns';

const dbName = 'sunlit_db';
const storeName = 'journals';

function openJournalsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => {
      reject(request.error);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'created_at' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export async function postJournalDb(value: string) {
  const dateNow = Date.now();
  const journal = { created_at: format(dateNow, 'yyyy-MM-dd'), uuid: dateNow, notes: value };
  const db = await openJournalsDb();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.put(journal);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDb(key: string): Promise<string> {
  const db = await openJournalsDb();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);

  const request = store.get(key);

  return new Promise((resolve, reject) => {
    (request.onsuccess = () => resolve(request.result ? request.result.notes : null)),
      (request.onerror = () => reject(request.error));
  });
}
