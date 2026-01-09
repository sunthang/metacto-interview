import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const dbPath = process.env.DB_PATH || './features.db';
const db = new sqlite3.Database(dbPath);

const dbAll = promisify(db.all.bind(db));
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

// User functions
export async function createUser(username, passwordHash) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username });
      }
    );
  });
}

export async function getUserByUsername(username) {
  return dbGet('SELECT * FROM users WHERE username = ?', [username]);
}

export async function getUserById(id) {
  return dbGet('SELECT * FROM users WHERE id = ?', [id]);
}

// Feature functions
export async function getAllFeatures(userId = null) {
  const features = await dbAll(`
    SELECT 
      f.id,
      f.name,
      f.created_by,
      u.username as creator_username,
      COUNT(v.id) as votes
    FROM features f
    LEFT JOIN users u ON f.created_by = u.id
    LEFT JOIN votes v ON f.id = v.feature_id
    GROUP BY f.id
    ORDER BY votes DESC, f.name ASC
  `);
  
  // Convert votes from string to number (SQLite returns COUNT as string)
  const processedFeatures = features.map(f => ({
    ...f,
    votes: typeof f.votes === 'string' ? parseInt(f.votes, 10) : f.votes,
    has_voted: false // Default to false
  }));
  
  // If userId provided, check if user has voted for each feature
  if (userId) {
    for (const feature of processedFeatures) {
      const voted = await hasUserVoted(userId, feature.id);
      feature.has_voted = Boolean(voted); // Ensure boolean
    }
  }
  
  return processedFeatures;
}

export async function createFeature(name, createdBy) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO features (name, created_by) VALUES (?, ?)',
      [name, createdBy],
      async function(err) {
        if (err) reject(err);
        else {
          const feature = await dbGet('SELECT * FROM features WHERE id = ?', [this.lastID]);
          const user = await getUserById(createdBy);
          resolve({ 
            id: feature.id, 
            name: feature.name, 
            created_by: feature.created_by,
            creator_username: user.username,
            votes: 0 
          });
        }
      }
    );
  });
}

export async function getFeatureById(id, userId = null) {
  const feature = await dbGet('SELECT * FROM features WHERE id = ?', [id]);
  if (!feature) return null;
  
  const user = await getUserById(feature.created_by);
  const voteCount = await dbGet('SELECT COUNT(*) as count FROM votes WHERE feature_id = ?', [id]);
  
  const result = {
    ...feature,
    creator_username: user.username,
    votes: typeof voteCount.count === 'string' ? parseInt(voteCount.count, 10) : voteCount.count
  };
  
  // If userId provided, check if user has voted
  if (userId) {
    result.has_voted = await hasUserVoted(userId, id);
  } else {
    result.has_voted = false;
  }
  
  return result;
}

// Vote functions
export async function createVote(userId, featureId) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO votes (user_id, feature_id) VALUES (?, ?)',
      [userId, featureId],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, user_id: userId, feature_id: featureId });
      }
    );
  });
}

export async function hasUserVoted(userId, featureId) {
  const vote = await dbGet(
    'SELECT * FROM votes WHERE user_id = ? AND feature_id = ?',
    [userId, featureId]
  );
  return !!vote;
}

export async function getVoteCount(featureId) {
  const result = await dbGet(
    'SELECT COUNT(*) as count FROM votes WHERE feature_id = ?',
    [featureId]
  );
  return result.count;
}

export async function upvoteFeature(userId, featureId) {
  await createVote(userId, featureId);
  return getFeatureById(featureId, userId);
}

// Cleanup functions
export async function deleteAllVotes() {
  await dbRun('DELETE FROM votes');
}

export async function deleteAllFeatures() {
  await dbRun('DELETE FROM votes');
  await dbRun('DELETE FROM features');
}

export async function deleteAllUsers() {
  await dbRun('DELETE FROM votes');
  await dbRun('DELETE FROM features');
  await dbRun('DELETE FROM users');
}

export function closeDatabase() {
  db.close();
}
