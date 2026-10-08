"use client";

/**
 * Minimal promise-based IndexedDB helper. Everything SignSpeak stores —
 * custom gesture samples, settings, history — lives here, on-device only.
 */

export function openDatabase(
  name: string,
  version: number,
  stores: string[],
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of stores) {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: "id" });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function putAll<T>(db: IDBDatabase, store: string, records: T[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const os = tx.objectStore(store);
    for (const r of records) os.put(r);
  });
}

export function getAll<T>(db: IDBDatabase, store: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export function deleteByIds(db: IDBDatabase, store: string, ids: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const os = tx.objectStore(store);
    for (const id of ids) os.delete(id);
  });
}
