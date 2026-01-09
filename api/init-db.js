import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const dbPath = process.env.DB_PATH || './features.db';
const db = new sqlite3.Database(dbPath);

const dbRun = promisify(db.run.bind(db));

async function initDatabase() {
  try {
    // Create tables only if they don't exist (preserves data on restart)
    
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Features table (with created_by)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_by INTEGER NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Votes table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        feature_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (feature_id) REFERENCES features(id),
        UNIQUE(user_id, feature_id)
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
