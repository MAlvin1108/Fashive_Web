// models/FavoriteDB.js
import { openDB } from 'idb';

const DB_NAME = 'story-favorites-db';
const STORE_NAME = 'favorites';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' }); // ID dari server dipakai langsung
    }
  },
});

const FavoriteDB = {
  async add(story) {
    const db = await dbPromise;
    return db.put(STORE_NAME, story); // put bisa insert/update
  },

  async getAll() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async delete(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },

  async isFavorited(id) {
    const db = await dbPromise;
    const result = await db.get(STORE_NAME, id);
    return !!result;
  },
};

export default FavoriteDB;
