# Feature Voting System - Plan

## Tech Stack
- **Frontend**: React Native with Expo (iOS + Web)
- **Backend**: Node.js/Express API
- **Database**: SQLite (simple, no external setup)

## Monorepo Structure
```
/
├── ui/          # React Native/Expo frontend
├── api/         # Node.js/Express backend
└── shared/      # Shared types/utilities
```

## Architecture

### Database Schema
- `features` table:
  - `id` (primary key)
  - `name` (text, unique)
  - `votes` (integer, default 0)

### Backend API Endpoints
- `GET /api/features` - Get all features
- `POST /api/features` - Create new feature (body: `{ name: string }`)
- `POST /api/features/:id/upvote` - Increment vote count

### Frontend UI
- Single page app
- **Top section**: Grid of features
  - Each row: Feature name | +1 button
  - Display vote count
- **Bottom section**: 
  - Text input (placeholder: "add your own feature!")
  - "Post" button
- **Accessibility Requirements**:
  - Contrasting colors for readability
  - Labels for all interactive elements
  - Semantic components (buttons, text inputs, etc.)

## Code Quality Requirements
- Use environment variables for configuration (API URL)
- Modular component structure (separate files for components, services, config)
- Meaningful and brief code comments
- App.js should only handle main app orchestration

## Implementation Order
1. Database setup (SQLite schema) → Test database functions
2. Backend API (Express server) → Test API endpoints
3. Frontend UI (React Native/Expo) → Test UI components
4. Connect frontend to backend → Test full integration
5. Refactor: env file, modular structure, comments
6. Add web support → Test on web browser

## Production Enhancements

### 1. Database Schema Updates
- **Users table**: `id`, `username` (unique), `password_hash`, `created_at`
- **Features table updates**: 
  - Add `created_by` (user_id foreign key)
- **Votes table**: `id`, `user_id`, `feature_id` (unique constraint: one vote per user per feature)
- **Voting rules**: 
  - One vote per user per feature (enforced by unique constraint)
  - No self-upvotes (validation: user_id ≠ feature.created_by)

### 2. Dockerize Backend
- Dockerfile for backend API only
- SQLite database persists via Docker volume
- No additional infrastructure (single container)

### 3. JWT Authentication
- Register endpoint: `POST /api/auth/register` (username, password)
- Login endpoint: `POST /api/auth/login` (username, password) → returns JWT
- JWT secret from environment variable
- Protect endpoints:
  - `POST /api/features` (requires auth)
  - `POST /api/features/:id/upvote` (requires auth)
- Middleware to verify JWT on protected routes

### 4. Login/Signup Screen
- Login screen: username + password input
- Signup screen: username + password input (or combined form)
- If username exists → login, if not → create user
- Store JWT token in app state/localStorage
- Show login screen if not authenticated
- Show main app if authenticated
- Feature creation and voting only accessible when authenticated

### 5. Logout Functionality
- Logout button in header component
- On logout: clear auth token and user data
- Return user to login screen after logout

### 6. Real-Time Sync with WebSockets (MVP)
- Backend: Install socket.io, attach to Express server
- Backend: Emit `feature_created` event on feature creation
- Backend: Emit `feature_upvoted` event on vote
- Frontend: Install socket.io-client, connect on mount
- Frontend: Listen for events and update feature list automatically
- No authentication required for WebSocket connections (MVP)

### 7. Final Cleanup
- Ensure all code is properly commented
- Remove console logs, debug statements, and commented-out code
- Ensure READMEs are accurate and up-to-date
- Move tests to dedicated `tests/` folder
- Remove unused code and props