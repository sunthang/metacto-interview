# Feature Voting System

A full-stack feature voting application where users can post feature requests and vote on them. Built with React Native (Expo), Node.js/Express, and SQLite.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Feature Management**: Users can create feature requests
- **Voting System**: Users can upvote features (one vote per user per feature)
- **Vote Status**: Visual indicators show when a user has already voted (green checkmark)
- **Creator Protection**: Users cannot vote on their own features
- **Real-Time Sync**: Features and votes sync automatically across all connected clients (WebSockets)
- **Multi-Platform**: Works on iOS and Web
- **Docker Support**: Backend can be run in a Docker container

## Tech Stack

- **Frontend**: React Native with Expo (iOS + Web)
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time**: Socket.io (WebSockets)
- **Containerization**: Docker

## Project Structure

```
/
├── api/          # Backend API (Node.js/Express)
├── ui/           # Frontend (React Native/Expo)
└── shared/       # Shared utilities (if needed)
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm
- Docker Desktop (optional, for containerized backend)
- iOS Simulator or physical device (for iOS testing)
- Expo CLI (installed globally or via npx)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd metacto-interview
```

### 2. Backend Setup

#### Option A: Run with Docker (Recommended)

```bash
cd api

# Build the Docker image
docker build -t feature-voting-api .

# Run the container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e JWT_SECRET=your-secret-key-here \
  --name feature-voting-api \
  feature-voting-api
```

The database will persist in `api/data/features.db`.

#### Option B: Run Locally

```bash
cd api

# Install dependencies
npm install

# Set environment variables
export JWT_SECRET=your-secret-key-here
export DB_PATH=./features.db

# Initialize database
npm run init-db

# Start the server
npm start
```

The server will run on `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd ui

# Install dependencies
npm install

# Start Expo development server
npm start
```

Then:
- Press `i` for iOS simulator
- Press `w` for web browser
- Scan QR code with Expo Go app (for physical device)

### 4. Configuration

#### Backend Environment Variables

Create `api/.env` (for local development) or set environment variables:

- `JWT_SECRET`: Secret key for JWT token signing (required)
- `DB_PATH`: Path to SQLite database file (default: `./features.db`)

#### Frontend API URL

Edit `ui/config/constants.js` to set the API URL:

- iOS Simulator: `http://localhost:3000/api`
- Physical Device: `http://<your-computer-ip>:3000/api`
- Web: `http://localhost:3000/api`

## Usage

1. **Register/Login**: Enter a username and password. If the username exists, you'll be logged in. If not, a new account will be created.

2. **Create Features**: Enter a feature name in the input field at the bottom and click "Post".

3. **Vote on Features**: Click the "+1" button next to any feature (except your own). After voting, the button turns green with a checkmark (✓).

4. **Logout**: Click the "Logout" button in the header to return to the login screen.

## API Endpoints

### Public Endpoints

- `GET /api/features` - Get all features (includes vote status if authenticated)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username and password

### Protected Endpoints (Require JWT Token)

- `POST /api/features` - Create a new feature
- `POST /api/features/:id/upvote` - Vote on a feature

## Testing

### Backend Tests

```bash
cd api

# Run all tests
npm run test-all

# Individual test suites
npm run test-db          # Database functions
npm run test-schema      # Database schema
npm run test-auth        # Authentication endpoints
npm run test-endpoints   # Feature endpoints
npm run test-e2e         # End-to-end tests
```

### Frontend Testing

Test on:
- iOS Simulator: `npm run ios`
- Web Browser: `npm run web`

## Database Schema

- **users**: id, username (unique), password_hash, created_at
- **features**: id, name (unique), created_by (user_id)
- **votes**: id, user_id, feature_id (unique constraint: one vote per user per feature)

## Voting Rules

- Users can only vote once per feature
- Users cannot vote on their own features
- Vote status is shown with a green checkmark (✓) after voting

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Docker Issues

- Ensure Docker Desktop is running
- Check container logs: `docker logs feature-voting-api`
- Restart container: `docker restart feature-voting-api`

### Database Issues

- Database files: `api/features.db` (local) or `api/data/features.db` (Docker)
- Reset database: Delete the `.db` file and run `npm run init-db`

## Development

### Project Structure

- `api/` - Backend API with Express routes, database functions, and middleware
- `ui/` - React Native frontend with Expo
- `api/middleware/` - Authentication middleware
- `api/routes/` - API route handlers
- `ui/components/` - React components
- `ui/services/` - API and authentication services

### Code Quality

- Modular component structure
- Environment variable configuration
- Meaningful code comments
- Separation of concerns (App.js handles orchestration, components handle CRUD)

## License

This project is part of a technical interview exercise.
