import { createUser, getUserByUsername, createFeature, createVote, hasUserVoted, getVoteCount, getAllFeatures, deleteAllUsers, closeDatabase } from './db.js';

async function testSchema() {
  try {
    console.log('Testing new database schema...\n');

    // Clean up
    await deleteAllUsers();

    // Test: Create user
    console.log('1. Creating user...');
    const passwordHash = 'test_hash_placeholder'; // Will use bcrypt in Phase 3
    const user = await createUser('testuser', passwordHash);
    console.log('   Created user:', user);

    // Test: Get user by username
    console.log('\n2. Getting user by username...');
    const foundUser = await getUserByUsername('testuser');
    console.log('   Found user:', { id: foundUser.id, username: foundUser.username });

    // Test: Create feature with created_by
    console.log('\n3. Creating feature...');
    const feature = await createFeature('Test Feature', user.id);
    console.log('   Created feature:', feature);

    // Test: Create vote
    console.log('\n4. Creating vote...');
    await createVote(user.id, feature.id);
    console.log('   Vote created');

    // Test: Check if user voted
    console.log('\n5. Checking if user voted...');
    const voted = await hasUserVoted(user.id, feature.id);
    console.log('   User voted:', voted);

    // Test: Get vote count
    console.log('\n6. Getting vote count...');
    const count = await getVoteCount(feature.id);
    console.log('   Vote count:', count);

    // Test: Get all features
    console.log('\n7. Getting all features...');
    const allFeatures = await getAllFeatures();
    console.log('   All features:', allFeatures);

    console.log('\n✅ All schema tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

testSchema();
