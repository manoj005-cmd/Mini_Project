import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import fs from 'fs'
import path from 'path'

const router = Router();

const logPath = path.join(process.cwd(), 'server.log')
function audit(msg) {
  try { fs.appendFileSync(logPath, `${new Date().toISOString()} ${msg}\n`) } catch (e) { /* ignore */ }
}

function signToken(user) {
  const payload = { sub: user._id.toString(), email: user.email, username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    audit(`REGISTER attempt email=${email} username=${username}`)
    if (!email || !password || !username) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, username });
    const token = signToken(user);
    audit(`REGISTER success id=${user._id} email=${user.email}`)
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (e) {
    audit(`REGISTER error ${e && e.message}`)
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    audit(`LOGIN attempt email=${email}`)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    audit(`LOGIN success id=${user._id} email=${user.email}`)
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (e) {
    audit(`LOGIN error ${e && e.message}`)
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;




