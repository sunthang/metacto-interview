# Feature Voting API

Backend API for the Feature Voting System. Built with Node.js, Express, and SQLite.

## Features

- RESTful API for feature management
- JWT-based authentication
- User registration and login
- Feature creation and voting
- Vote status tracking
- Real-time updates via WebSockets (Socket.io)
- Docker containerization support

## Quick Start

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Set environment variables
export JWT_SECRET=your-secret-key-here
export DB_PATH=./features.db

# Initialize database
npm run init-db

# Start server
npm start
```

Server runs on `http://localhost:3000`

## Environment Variables

See [README-ENV.md](./README-ENV.md) for detailed environment variable documentation.

Required:
- `JWT_SECRET`: Secret key for JWT token signing

Optional:
- `DB_PATH`: Path to SQLite database (default: `./features.db`)

## Docker

See [README-DOCKER.md](./README-DOCKER.md) for Docker setup instructions.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ username: string, password: string }`
  - Returns: `{ token: string, user: { id, username } }`

- `POST /api/auth/login` - Login with credentials
  - Body: `{ username: string, password: string }`
  - Returns: `{ token: string, user: { id, username } }`

### Features

- `GET /api/features` - Get all features
  - Public endpoint
  - If authenticated (Bearer token), includes `has_voted` status for each feature
  - Returns: `[{ id, name, created_by, creator_username, votes, has_voted }]`

- `POST /api/features` - Create a new feature (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name: string }`
  - Returns: `{ id, name, created_by, creator_username, votes }`

- `POST /api/features/:id/upvote` - Vote on a feature (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ id, name, created_by, creator_username, votes, has_voted }`
  - Errors:
    - `403`: Cannot upvote your own feature
    - `409`: Already voted for this feature

## Database

SQLite database with three tables:

- **users**: User accounts with hashed passwords
- **features**: Feature requests linked to creators
- **votes**: Vote records with unique constraint (user_id, feature_id)

Database initialization: `npm run init-db`

## Testing

```bash
# Run all tests
npm run test-all

# Individual test suites
npm run test-db          # Database functions
npm run test-schema      # Database schema
npm run test-auth        # Authentication
npm run test-endpoints   # Feature endpoints
npm run test-e2e         # End-to-end flow
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Scripts

- `npm start` - Start the server
- `npm run init-db` - Initialize/reset the database
- `npm run test-*` - Run test suites

## Project Structure

```
api/
├── db.js              # Database functions
├── server.js          # Express server, routes, and WebSocket
├── init-db.js         # Database initialization
├── middleware/
│   └── auth.js        # JWT authentication middleware
├── routes/
│   └── auth.js        # Authentication routes
└── tests/             # Test files
    ├── test-db.js
    ├── test-schema.js
    ├── test-auth.js
    ├── test-endpoints.js
    └── test-e2e.js
```
