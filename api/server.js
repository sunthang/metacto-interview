import express from 'express';
import cors from 'cors';
import { getAllFeatures, createFeature, upvoteFeature } from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/features', async (req, res) => {
  try {
    const features = await getAllFeatures();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/features', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Feature name is required' });
    }
    const feature = await createFeature(name.trim());
    res.status(201).json(feature);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(409).json({ error: 'Feature already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/features/:id/upvote', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid feature ID' });
    }
    const feature = await upvoteFeature(id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the process or use a different port.`);
    process.exit(1);
  } else {
    throw error;
  }
});
