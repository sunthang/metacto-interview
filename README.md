# Feature Voting App

A full-stack feature voting application with real-time updates. Users can register, submit feature requests, and vote on features.

## Quick Start

### 1. Start the API

```bash
cd api
npm install
export JWT_SECRET=your-secret-key
npm run init-db
npm start
```

Or with Docker:

```bash
cd api
docker compose up -d
```

API runs on `http://localhost:3000`

### 2. Start the UI

```bash
cd ui
npm install
npm run ios    # iOS Simulator
npm run web    # Web browser
```

## Project Structure

```
├── api/          # Node.js/Express backend
│   ├── server.js       # REST API + WebSocket server
│   ├── db.js           # SQLite database functions
│   └── routes/auth.js  # Authentication endpoints
└── ui/           # React Native/Expo frontend
    ├── App.js          # Main app component
    ├── components/     # UI components
    └── services/       # API and auth services
```

## Available Scripts

### API (`cd api`)

| Script | Description |
|--------|-------------|
| `npm start` | Start the server |
| `npm run init-db` | Initialize/reset database |
| `npm run test-all` | Run all tests |

### UI (`cd ui`)

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS Simulator |
| `npm run web` | Run in web browser |

## Tech Stack

- **Backend**: Node.js, Express, SQLite, Socket.io, JWT
- **Frontend**: React Native, Expo, WebSockets
