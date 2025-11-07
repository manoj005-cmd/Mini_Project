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

router.get('/', requireAuth, async (req, res) => {
  const visualizations = await Visualization.find({ userId: req.user.sub });
  const stats = {
    visualizationsRun: visualizations.length,
    quizzesCompleted: 0, // extend if you store quiz results
    algorithmsAvailable: 6,
    daysActive: new Set(visualizations.map(v => v.createdAt.toISOString().slice(0, 10))).size
  };
  res.json({ stats });
});

router.post('/export', requireAuth, async (req, res) => {
  const visualizations = await Visualization.find({ userId: req.user.sub });
  const payload = { exportedAt: new Date().toISOString(), visualizations };
  res.setHeader('Content-Disposition', 'attachment; filename="algovision_report.json"');
  res.json(payload);
});

export default router;




