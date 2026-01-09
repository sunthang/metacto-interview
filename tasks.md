# Implementation Tasks

## Database Setup
- [x] Initialize SQLite database in `api/`
- [x] Create database schema (features table: id, name, votes)
- [x] Create database initialization script
- [x] Test database connection
- [x] Test database functions (create, get all, upvote)
- [x] Add cleanup to database tests

## Backend API
- [x] Set up Express server in `api/`
- [x] Create GET /api/features endpoint
- [x] Create POST /api/features endpoint
- [x] Create POST /api/features/:id/upvote endpoint
- [x] Add CORS middleware for mobile app
- [x] Test all endpoints
- [x] Add cleanup to API tests

## Frontend UI
- [x] Initialize Expo app in `ui/`
- [x] Create main screen component
- [x] Implement features grid/list display
- [x] Add +1 button for each feature
- [x] Add input field and Post button at bottom
- [x] Connect to backend API
- [x] Handle loading and error states
- [ ] Add cleanup to UI tests
- [x] Make UI accessible: contrasting colors, labels, semantic components
- [x] Create .env file for API URL configuration (config/constants.js)
- [x] Refactor: split App.js into modular components
- [x] Add meaningful code comments
- [x] Test and verify web support (Expo web)

## Shared
- [ ] Create shared types/interfaces (if needed)

## Production Enhancements - MVP

### Phase 1: Database Schema Updates
- [x] Update `init-db.js`: Create users table, votes table, update features table with created_by
- [x] Update `db.js`: Add user functions (createUser, getUserByUsername, verifyPassword)
- [x] Update `db.js`: Add vote functions (createVote, hasUserVoted, getVoteCount)
- [x] Update `db.js`: Update feature functions to include created_by field
- [x] Test database schema updates

### Phase 2: Dockerize Backend
- [x] Create `api/Dockerfile`
- [x] Create `api/.dockerignore`
- [x] Test Docker build and run

### Phase 3: JWT Authentication Backend
- [x] Install dependencies: jsonwebtoken, bcrypt
- [x] Create `api/middleware/auth.js`: JWT verification middleware
- [x] Create `api/routes/auth.js`: Register and login endpoints
- [x] Update `api/server.js`: Add auth routes and protect endpoints
- [x] Add JWT_SECRET to environment variables (README-ENV.md created)
- [x] Test auth endpoints (all tests passing)

### Phase 4: Update Feature Endpoints
- [x] Update `POST /api/features`: Require auth, set created_by from JWT
- [x] Update `POST /api/features/:id/upvote`: Require auth, enforce voting rules
- [x] Update `GET /api/features`: Include creator username and vote count
- [x] Test updated endpoints (all tests passing)

### Phase 5: Login/Signup UI
- [x] Create `ui/components/LoginScreen.js`
- [x] Create `ui/services/auth.js`: Register, login, token storage
- [x] Update `ui/App.js`: Add auth check and token handling
- [x] Update `ui/services/api.js`: Include auth tokens in requests
- [x] Test login/signup flow (tested on iOS and web)

### Phase 6: Update Feature Display UI
- [x] Update `ui/components/FeatureRow.js`: Display creator, disable upvote if needed
- [x] Update `ui/components/FeatureList.js`: Pass user info, handle disabled buttons
- [x] Update `ui/App.js`: Pass current user to FeatureList
- [x] Test feature display with creator info (tested on iOS and web)

### Phase 7: Voting Rules Enforcement
- [x] Update `ui/services/api.js`: Handle voting error cases (403, 409, 401)
- [x] Update UI to disable upvote buttons for creator/already voted
- [x] Add green checkmark for voted features
- [x] Update API to include `has_voted` status in feature responses
- [x] Test voting restrictions (tested on iOS and web)

### Phase 8: Logout Functionality
- [x] Add logout function to `ui/services/auth.js`
- [x] Add logout button to `ui/components/Header.js`
- [x] Update `ui/App.js` to handle logout and return to login screen
- [x] Test logout flow (tested on iOS and web)

### Phase 9: Real-Time Sync with WebSockets
- [x] Install socket.io in backend
- [x] Create Socket.io server attached to Express
- [x] Emit feature_created event on POST /api/features
- [x] Emit feature_upvoted event on POST /api/features/:id/upvote
- [x] Install socket.io-client in frontend
- [x] Create WebSocket service (ui/services/websocket.js)
- [x] Connect WebSocket on auth, disconnect on logout
- [x] Listen for events and update feature list automatically
- [x] Test real-time sync across iOS and web

### Phase 10: Final Cleanup
- [x] Ensure all code is properly commented
- [x] Remove console logs and debug statements from production code
- [x] Remove commented-out code
- [x] Ensure READMEs are accurate and reflect current state
- [x] Move tests to dedicated `api/tests/` folder
- [x] Remove unused code and props

### Testing & Verification
- [x] End-to-end test: register → login → create feature → upvote → verify restrictions
- [x] Test on iOS simulator
- [x] Test on web browser
- [x] Verify Docker container works
- [x] Test real-time sync across platforms
