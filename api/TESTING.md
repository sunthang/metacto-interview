# Testing Guide

## Running Tests

Make sure the server is running before executing tests:
```bash
cd api
JWT_SECRET=test-secret-key npm start
```

In another terminal, run tests:

### Individual Test Suites
- `npm run test-db` - Database functions
- `npm run test-schema` - Database schema (users, votes, features)
- `npm run test-auth` - Authentication endpoints
- `npm run test-endpoints` - Feature endpoints with auth
- `npm run test-e2e` - Complete end-to-end flow

### Run All Tests
```bash
npm run test-all
```

## Test Coverage

### Database Tests (`test-db.js`)
- Create, read features
- Upvote functionality
- Cleanup operations

### Schema Tests (`test-schema.js`)
- User creation and retrieval
- Feature creation with creator
- Vote creation and tracking
- Vote count aggregation

### Auth Tests (`test-auth.js`)
- User registration
- User login
- Password verification
- Duplicate username prevention
- Protected endpoint access

### Endpoint Tests (`test-endpoints.js`)
- Feature creation with auth
- Feature listing with creator info
- Upvoting with different users
- Self-upvote prevention
- Duplicate vote prevention
- Unauthorized access prevention

### E2E Tests (`test-e2e.js`)
Complete user flow:
1. Register new user
2. Login existing user
3. Register second user
4. Create feature (authenticated)
5. Get all features (includes creator)
6. Upvote feature (different user)
7. Prevent self-upvote
8. Prevent duplicate vote
9. Create feature without auth (should fail)
10. Upvote without auth (should fail)
11. Multiple users can vote on same feature
12. Verify final vote count

## Expected Results

All tests should pass with ✅ indicators. Any ❌ indicates a failure that needs to be addressed.

## Troubleshooting

- **Port 3000 in use**: Kill existing process or change port
- **Database locked**: Ensure only one test runs at a time
- **Auth failures**: Verify JWT_SECRET is set correctly
- **Connection refused**: Make sure server is running on localhost:3000
