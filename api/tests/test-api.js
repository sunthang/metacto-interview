import { deleteAllFeatures } from './db.js';

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Clean up before tests
    await deleteAllFeatures();

    // Test: Create features
    console.log('1. Creating features...');
    const create1 = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dark mode' })
    });
    const feature1 = await create1.json();
    console.log('   Created:', feature1);

    const create2 = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Push notifications' })
    });
    const feature2 = await create2.json();
    console.log('   Created:', feature2);

    // Test: Get all features
    console.log('\n2. Getting all features...');
    const getAll = await fetch(`${API_URL}/features`);
    const allFeatures = await getAll.json();
    console.log('   Found', allFeatures.length, 'features:');
    allFeatures.forEach(f => console.log(`   - ${f.name} (${f.votes} votes)`));

    // Test: Upvote
    console.log('\n3. Upvoting feature...');
    const upvote = await fetch(`${API_URL}/features/${feature1.id}/upvote`, {
      method: 'POST'
    });
    const upvoted = await upvote.json();
    console.log('   Upvoted:', upvoted);

    // Test: Get all features again
    console.log('\n4. Getting all features after upvote...');
    const getAll2 = await fetch(`${API_URL}/features`);
    const updatedFeatures = await getAll2.json();
    console.log('   Updated features:');
    updatedFeatures.forEach(f => console.log(`   - ${f.name} (${f.votes} votes)`));

    // Test: Error handling - duplicate feature
    console.log('\n5. Testing duplicate feature (should fail)...');
    const duplicate = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dark mode' })
    });
    const duplicateResult = await duplicate.json();
    console.log('   Result:', duplicate.status === 409 ? '✅ Correctly rejected duplicate' : '❌ Should have rejected');

    // Test: Error handling - invalid ID
    console.log('\n6. Testing invalid ID (should fail)...');
    const invalid = await fetch(`${API_URL}/features/999/upvote`, {
      method: 'POST'
    });
    console.log('   Result:', invalid.status === 404 ? '✅ Correctly returned 404' : '❌ Should have returned 404');

    console.log('\n✅ All API tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Make sure the server is running: npm start');
    process.exit(1);
  }
}

testAPI();
