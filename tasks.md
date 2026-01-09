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
- [ ] Test and verify web support (Expo web)

## Shared
- [ ] Create shared types/interfaces (if needed)
