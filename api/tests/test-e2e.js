import { deleteAllUsers, deleteAllFeatures, deleteAllVotes } from './db.js';
import { closeDatabase } from './db.js';

const API_URL = 'http://localhost:3000/api';

/**
 * Comprehensive end-to-end test covering the full MVP flow
 */
async function testE2E() {
  let passed = 0;
  let failed = 0;

  const test = (name, fn) => {
    return async () => {
      try {
        await fn();
        console.log(`✅ ${name}`);
        passed++;
      } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        failed++;
      }
    };
  };

  try {
    console.log('🧪 Running End-to-End MVP Tests\n');
    console.log('='.repeat(60));

    // Clean up
    await deleteAllVotes();
    await deleteAllFeatures();
    await deleteAllUsers();

    // Test 1: Register new user
    await test('1. Register new user', async () => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'alice', password: 'password123' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.token || !data.user) throw new Error('Missing token or user');
      return data;
    })();

    // Test 2: Login existing user
    let aliceToken;
    await test('2. Login existing user', async () => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'alice', password: 'password123' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      aliceToken = data.token;
      if (!data.token || !data.user) throw new Error('Missing token or user');
      return data;
    })();

    // Test 3: Register second user
    let bobToken;
    await test('3. Register second user', async () => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'bob', password: 'password456' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      bobToken = data.token;
      if (!data.token || !data.user) throw new Error('Missing token or user');
      return data;
    })();

    // Test 4: Create feature (authenticated)
    let featureId;
    await test('4. Create feature (authenticated)', async () => {
      const res = await fetch(`${API_URL}/features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aliceToken}`
        },
        body: JSON.stringify({ name: 'Dark Mode' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      featureId = data.id;
      if (!data.id || !data.name || !data.created_by || !data.creator_username) {
        throw new Error('Missing required fields');
      }
      if (data.votes !== 0) throw new Error('Initial vote count should be 0');
      return data;
    })();

    // Test 5: Get all features (includes creator)
    await test('5. Get all features (includes creator)', async () => {
      const res = await fetch(`${API_URL}/features`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Should return array');
      if (data.length === 0) throw new Error('Should have at least one feature');
      const feature = data.find(f => f.id === featureId);
      if (!feature) throw new Error('Created feature not found');
      if (!feature.creator_username) throw new Error('Missing creator_username');
      if (feature.creator_username !== 'alice') throw new Error('Wrong creator');
      return data;
    })();

    // Test 6: Upvote feature (different user)
    await test('6. Upvote feature (different user)', async () => {
      const res = await fetch(`${API_URL}/features/${featureId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${bobToken}` }
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.votes !== 1) throw new Error(`Expected 1 vote, got ${data.votes}`);
      return data;
    })();

    // Test 7: Prevent self-upvote
    await test('7. Prevent self-upvote', async () => {
      const res = await fetch(`${API_URL}/features/${featureId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${aliceToken}` }
      });
      if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
      const data = await res.json();
      if (!data.error) throw new Error('Should return error message');
      return data;
    })();

    // Test 8: Prevent duplicate vote
    await test('8. Prevent duplicate vote', async () => {
      const res = await fetch(`${API_URL}/features/${featureId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${bobToken}` }
      });
      if (res.status !== 409) throw new Error(`Expected 409, got ${res.status}`);
      const data = await res.json();
      if (!data.error) throw new Error('Should return error message');
      return data;
    })();

    // Test 9: Create feature without auth (should fail)
    await test('9. Create feature without auth (should fail)', async () => {
      const res = await fetch(`${API_URL}/features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Unauthorized Feature' })
      });
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
      return true;
    })();

    // Test 10: Upvote without auth (should fail)
    await test('10. Upvote without auth (should fail)', async () => {
      const res = await fetch(`${API_URL}/features/${featureId}/upvote`, {
        method: 'POST'
      });
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
      return true;
    })();

    // Test 11: Multiple users can vote on same feature
    let charlieToken;
    await test('11. Multiple users can vote on same feature', async () => {
      // Register third user
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'charlie', password: 'password789' })
      });
      const registerData = await registerRes.json();
      charlieToken = registerData.token;

      // Charlie votes
      const upvoteRes = await fetch(`${API_URL}/features/${featureId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${charlieToken}` }
      });
      if (!upvoteRes.ok) throw new Error(`Status ${upvoteRes.status}`);
      const upvoteData = await upvoteRes.json();
      if (upvoteData.votes !== 2) throw new Error(`Expected 2 votes, got ${upvoteData.votes}`);
      return upvoteData;
    })();

    // Test 12: Verify final vote count
    await test('12. Verify final vote count', async () => {
      const res = await fetch(`${API_URL}/features`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const feature = data.find(f => f.id === featureId);
      if (!feature) throw new Error('Feature not found');
      if (feature.votes !== 2) throw new Error(`Expected 2 votes, got ${feature.votes}`);
      return feature;
    })();

    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

    if (failed > 0) {
      console.error('❌ Some tests failed. Make sure the server is running: npm start');
      process.exit(1);
    } else {
      console.log('✅ All E2E tests passed!');
    }
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

testE2E();
