import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Visualization from '../models/Visualization.js';

const router = Router();

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { algorithm, inputSize, steps, durationMs, meta } = req.body;
    const doc = await Visualization.create({
      userId: req.user.sub,
      algorithm,
      inputSize,
      steps,
      durationMs,
      meta: meta || {}
    });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: 'Failed to log visualization' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  const items = await Visualization.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(50);
  res.json(items);
});

export default router;




