import { deleteAllUsers, deleteAllFeatures } from './db.js';
import { closeDatabase } from './db.js';

const API_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  try {
    console.log('Testing updated feature endpoints...\n');

    // Clean up
    await deleteAllFeatures();
    await deleteAllUsers();

    // Register two users
    console.log('1. Registering users...');
    const user1Res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user1', password: 'pass123' })
    });
    const user1 = await user1Res.json();
    const token1 = user1.token;

    const user2Res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user2', password: 'pass123' })
    });
    const user2 = await user2Res.json();
    const token2 = user2.token;

    console.log('   User1:', user1.user.username);
    console.log('   User2:', user2.user.username);

    // Test: Get all features (empty)
    console.log('\n2. Getting all features (should be empty)...');
    const getAllRes = await fetch(`${API_URL}/features`);
    const allFeatures = await getAllRes.json();
    console.log('   Features:', allFeatures.length === 0 ? 'Empty ✅' : allFeatures);

    // Test: Create feature with auth
    console.log('\n3. Creating feature with user1...');
    const createRes = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({ name: 'Feature by User1' })
    });
    const feature = await createRes.json();
    console.log('   Status:', createRes.status);
    console.log('   Feature:', {
      id: feature.id,
      name: feature.name,
      created_by: feature.created_by,
      creator_username: feature.creator_username,
      votes: feature.votes
    });
    if (!createRes.ok) throw new Error('Feature creation failed');

    // Test: Get all features (should include creator)
    console.log('\n4. Getting all features (should include creator)...');
    const getAllRes2 = await fetch(`${API_URL}/features`);
    const allFeatures2 = await getAllRes2.json();
    console.log('   Features:', allFeatures2);
    if (!allFeatures2[0].creator_username) {
      throw new Error('Creator username missing');
    }

    // Test: Upvote with user2 (should work)
    console.log('\n5. User2 upvoting feature (should work)...');
    const upvoteRes = await fetch(`${API_URL}/features/${feature.id}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token2}`
      }
    });
    const upvotedFeature = await upvoteRes.json();
    console.log('   Status:', upvoteRes.status);
    console.log('   Votes:', upvotedFeature.votes);
    if (upvoteRes.status !== 200 || upvotedFeature.votes !== 1) {
      throw new Error('Upvote failed');
    }

    // Test: Self-upvote (should fail)
    console.log('\n6. User1 trying to upvote own feature (should fail)...');
    const selfUpvoteRes = await fetch(`${API_URL}/features/${feature.id}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token1}`
      }
    });
    console.log('   Status:', selfUpvoteRes.status);
    console.log('   Result:', selfUpvoteRes.status === 403 ? '✅ Correctly rejected' : '❌ Should have rejected');

    // Test: Duplicate vote (should fail)
    console.log('\n7. User2 trying to vote again (should fail)...');
    const duplicateVoteRes = await fetch(`${API_URL}/features/${feature.id}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token2}`
      }
    });
    console.log('   Status:', duplicateVoteRes.status);
    console.log('   Result:', duplicateVoteRes.status === 409 ? '✅ Correctly rejected' : '❌ Should have rejected');

    // Test: Upvote without auth (should fail)
    console.log('\n8. Upvoting without auth token (should fail)...');
    const noAuthUpvoteRes = await fetch(`${API_URL}/features/${feature.id}/upvote`, {
      method: 'POST'
    });
    console.log('   Status:', noAuthUpvoteRes.status);
    console.log('   Result:', noAuthUpvoteRes.status === 401 ? '✅ Correctly rejected' : '❌ Should have rejected');

    console.log('\n✅ All endpoint tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

testEndpoints();
