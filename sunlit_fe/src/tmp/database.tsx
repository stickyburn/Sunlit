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
