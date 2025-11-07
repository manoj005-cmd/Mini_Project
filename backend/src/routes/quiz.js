import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quizPath = path.join(__dirname, '../data/quiz.json');

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(quizPath, 'utf-8');
    const data = JSON.parse(raw);
    res.json({ questions: data });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load quiz' });
  }
});

export default router;




