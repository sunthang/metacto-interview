import { deleteAllUsers } from './db.js';
import { closeDatabase } from './db.js';

const API_URL = 'http://localhost:3000/api';

async function testAuth() {
  try {
    console.log('Testing auth endpoints...\n');

    // Clean up
    await deleteAllUsers();

    // Test: Register new user
    console.log('1. Registering new user...');
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'testpass123' })
    });
    const registerData = await registerResponse.json();
    console.log('   Status:', registerResponse.status);
    console.log('   Response:', registerData);
    if (!registerResponse.ok) {
      throw new Error('Registration failed');
    }
    const token = registerData.token;

    // Test: Login with correct credentials
    console.log('\n2. Logging in with correct credentials...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'testpass123' })
    });
    const loginData = await loginResponse.json();
    console.log('   Status:', loginResponse.status);
    console.log('   Response:', { token: loginData.token ? 'present' : 'missing', user: loginData.user });
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    // Test: Login with wrong password
    console.log('\n3. Logging in with wrong password...');
    const wrongLoginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'wrongpass' })
    });
    console.log('   Status:', wrongLoginResponse.status);
    console.log('   Result:', wrongLoginResponse.status === 401 ? '✅ Correctly rejected' : '❌ Should have rejected');

    // Test: Register duplicate username
    console.log('\n4. Registering duplicate username...');
    const duplicateResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'anotherpass' })
    });
    console.log('   Status:', duplicateResponse.status);
    console.log('   Result:', duplicateResponse.status === 409 ? '✅ Correctly rejected' : '❌ Should have rejected');

    // Test: Create feature with auth token
    console.log('\n5. Creating feature with auth token...');
    const createFeatureResponse = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Test Feature' })
    });
    const featureData = await createFeatureResponse.json();
    console.log('   Status:', createFeatureResponse.status);
    console.log('   Feature:', featureData);
    if (!createFeatureResponse.ok) {
      throw new Error('Feature creation failed');
    }

    // Test: Create feature without auth token
    console.log('\n6. Creating feature without auth token...');
    const noAuthResponse = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Unauthorized Feature' })
    });
    console.log('   Status:', noAuthResponse.status);
    console.log('   Result:', noAuthResponse.status === 401 ? '✅ Correctly rejected' : '❌ Should have rejected');

    console.log('\n✅ All auth tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Make sure the server is running: npm start');
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

testAuth();
