import { getAllFeatures, createFeature, upvoteFeature, deleteAllFeatures, closeDatabase } from './db.js';

async function testDatabase() {
  try {
    console.log('Testing database functions...\n');

    // Clear existing data
    await deleteAllFeatures();

    // Test: Create features
    console.log('1. Creating features...');
    const feature1 = await createFeature('Dark mode');
    console.log('   Created:', feature1);
    
    const feature2 = await createFeature('Push notifications');
    console.log('   Created:', feature2);

    // Test: Get all features
    console.log('\n2. Getting all features...');
    const allFeatures = await getAllFeatures();
    console.log('   Found', allFeatures.length, 'features:');
    allFeatures.forEach(f => console.log(`   - ${f.name} (${f.votes} votes)`));

    // Test: Upvote
    console.log('\n3. Upvoting feature...');
    const upvoted = await upvoteFeature(feature1.id);
    console.log('   Upvoted:', upvoted);

    // Test: Get all features again
    console.log('\n4. Getting all features after upvote...');
    const updatedFeatures = await getAllFeatures();
    console.log('   Updated features:');
    updatedFeatures.forEach(f => console.log(`   - ${f.name} (${f.votes} votes)`));

    console.log('\n✅ All database tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

testDatabase();
