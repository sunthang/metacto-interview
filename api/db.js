import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('./features.db');

const dbAll = promisify(db.all.bind(db));
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

export async function getAllFeatures() {
  return dbAll('SELECT * FROM features ORDER BY votes DESC, name ASC');
}

export async function createFeature(name) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO features (name, votes) VALUES (?, 0)',
      [name],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name, votes: 0 });
      }
    );
  });
}

export async function upvoteFeature(id) {
  await dbRun('UPDATE features SET votes = votes + 1 WHERE id = ?', [id]);
  return dbGet('SELECT * FROM features WHERE id = ?', [id]);
}

export async function deleteAllFeatures() {
  await dbRun('DELETE FROM features');
}

export function closeDatabase() {
  db.close();
}
