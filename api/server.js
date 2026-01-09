import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getAllFeatures, createFeature, upvoteFeature, getFeatureById, hasUserVoted } from './db.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create HTTP server and Socket.io server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Track WebSocket connections
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Public: Get all features (optionally include vote status if user is authenticated)
app.get('/api/features', async (req, res) => {
  try {
    // Check if user is authenticated (optional)
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          // Use same secret as auth routes
          const secret = process.env.JWT_SECRET;
          if (secret) {
            try {
              const decoded = jwt.verify(token, secret);
              userId = decoded.id;
            } catch (verifyErr) {
              // Invalid token, continue without user context
            }
          }
        } catch (err) {
          // Invalid token, continue without user context
        }
      }
    }
    
    const features = await getAllFeatures(userId);
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected: Create feature (requires auth)
app.post('/api/features', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Feature name is required' });
    }
    const feature = await createFeature(name.trim(), req.user.id);
    
    // Broadcast feature_created event to all connected clients
    io.emit('feature_created', feature);
    
    res.status(201).json(feature);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(409).json({ error: 'Feature already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Protected: Upvote feature (requires auth)
app.post('/api/features/:id/upvote', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid feature ID' });
    }

    // Check if user already voted first (before fetching feature)
    const alreadyVoted = await hasUserVoted(req.user.id, id);
    if (alreadyVoted) {
      return res.status(409).json({ error: 'You have already voted for this feature' });
    }

    const feature = await getFeatureById(id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    // Check if user is creator (no self-upvotes)
    if (feature.created_by === req.user.id) {
      return res.status(403).json({ error: 'Cannot upvote your own feature' });
    }

    const updatedFeature = await upvoteFeature(req.user.id, id);
    
    // Get full feature for broadcast (without user-specific has_voted)
    const featureForBroadcast = await getFeatureById(id);
    featureForBroadcast.has_voted = false; // Broadcast doesn't include user-specific status
    
    // Broadcast feature_upvoted event to all connected clients
    io.emit('feature_upvoted', featureForBroadcast);
    
    res.json(updatedFeature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start HTTP server (Socket.io shares the same port)
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the process or use a different port.`);
    process.exit(1);
  } else {
    throw error;
  }
});
