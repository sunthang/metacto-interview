# Feature Voting UI

React Native frontend built with Expo. Supports iOS and Web platforms.

## Features

- User authentication (login/register)
- Feature list with vote counts
- Create new features
- Vote on features (with visual feedback)
- Real-time sync across all clients (WebSockets)
- Logout functionality
- Accessible UI with proper labels and semantic components

## Prerequisites

- Node.js (v20 or higher)
- npm
- Expo CLI (or use npx)
- iOS Simulator (for iOS) or modern web browser (for web)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Edit `config/constants.js` to set the API URL:

```javascript
export const API_URL = process.env.API_URL || 'http://localhost:3000/api';
```

- **iOS Simulator**: `http://localhost:3000/api`
- **Physical Device**: `http://<your-computer-ip>:3000/api`
- **Web**: `http://localhost:3000/api`

## Running

### iOS Simulator

```bash
npm run ios
```

### Web Browser

```bash
npm run web
```

### Development Server

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `w` for web browser
- Scan QR code with Expo Go app (for physical device)

## Project Structure

```
ui/
├── App.js                    # Main app component (auth orchestration)
├── components/
│   ├── LoginScreen.js        # Login/register screen
│   ├── Header.js             # App header with logout button
│   ├── FeatureList.js        # Feature list component
│   ├── FeatureRow.js         # Individual feature row
│   └── AddFeatureForm.js    # Form to add new features
├── services/
│   ├── api.js                # API service functions
│   ├── auth.js               # Authentication service
│   └── websocket.js          # WebSocket connection service
└── config/
    └── constants.js          # Configuration constants
```

## Features

### Authentication

- Combined login/register: Enter username and password
- If username exists → login
- If username doesn't exist → create account
- JWT token stored in AsyncStorage (mobile) or localStorage (web)

### Feature Management

- View all features sorted by votes (descending)
- Create new features (requires authentication)
- Vote on features (one vote per user per feature)
- Visual feedback: Green checkmark (✓) shows when you've voted
- Cannot vote on your own features

### UI Components

- **LoginScreen**: Authentication form
- **Header**: App title and logout button
- **FeatureList**: Displays all features with loading states
- **FeatureRow**: Individual feature with vote button/checkmark
- **AddFeatureForm**: Input and submit button for new features

## Requirements

- Backend API must be running on port 3000 (or configured URL)
- Backend must have JWT authentication enabled

## Troubleshooting

### Metro Bundler Issues

If you encounter bundler errors:
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Network Issues

- Ensure backend is running
- Check API URL in `config/constants.js`
- For physical devices, use your computer's IP address

### Platform-Specific Issues

- **iOS**: Requires Xcode and iOS Simulator
- **Web**: Requires `react-native-web` (already included)
