# Feature Voting App

A feature-voting application where users can submit feature ideas and upvote existing ones. The frontend is a React Native app built with Expo, and the backend is an Express API backed by SQLite.

---

## Tech Stack

### Frontend
- React Native (Expo)
- React 19
- Expo Go for local development

### Backend
- Node.js
- Express
- SQLite
- CORS enabled

---

## Project Structure

- `ui/` – Expo React Native frontend
- `api/` – Express API and SQLite database

---

## Getting Started

### 1. Install Dependencies

#### Backend
```bash
cd feature-voting-api
npm install
```

#### Frontend
```bash
cd ui
npm install
```

---

## Backend (API)

### Initialize the Database (first run)
```bash
npm run init-db
```

### Start the API Server
```bash
npm run start
```

The backend runs on:

```
http://localhost:3000
```

---

## API Endpoints

### Get all features
```
GET /api/features
```

Returns a list of features with their current vote counts.

---

### Create a new feature
```
POST /api/features
```

Request Body:
```json
{
  "name": "Dark mode"
}
```

- Feature names must be non-empty strings
- Duplicate feature names return `409 Conflict`

---

### Upvote a feature
```
POST /api/features/:id/upvote
```

Increments the vote count for the specified feature.

---

## Frontend (Expo React Native)

From the `ui` directory:

### Start the Expo dev server
```bash
npm run start
```

### Run on iOS Simulator
```bash
npm run ios
```

This will launch the app in the iOS simulator using Xcode.

### Other platform commands
```bash
npm run android
npm run web
```

---
