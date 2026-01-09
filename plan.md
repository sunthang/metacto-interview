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