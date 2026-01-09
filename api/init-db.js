import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('./features.db');

const dbRun = promisify(db.run.bind(db));

async function initDatabase() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        votes INTEGER DEFAULT 0
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

initDatabase();
