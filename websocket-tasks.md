# WebSocket Real-Time Sync - MVP Tasks

**Note**: No authentication required for WebSocket connections (endpoints are already protected)

## Backend

1. Install `socket.io` dependency
2. Create Socket.io server attached to Express HTTP server (same port 3000)
3. Emit `feature_created` event when `POST /api/features` succeeds
   - Event data: full feature object
4. Emit `feature_upvoted` event when `POST /api/features/:id/upvote` succeeds
   - Event data: updated feature object with vote count

## Frontend

5. Install `socket.io-client` dependency
6. Create WebSocket service to connect to server
7. Connect to WebSocket on app mount (when authenticated)
8. Listen for `feature_created` event → add to feature list
9. Listen for `feature_upvoted` event → update feature in list
10. Disconnect WebSocket on logout/unmount

## Testing

11. Test: Create feature on one client → verify other clients see it automatically
12. Test: Upvote on one client → verify other clients see updated count automatically
