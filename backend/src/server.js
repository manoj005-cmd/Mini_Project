import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRouter from './routes/auth.js'
import visualizationsRouter from './routes/visualizations.js'
import quizRouter from './routes/quiz.js'
import reportsRouter from './routes/reports.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
// morgan to console
app.use(morgan('dev'))
// also append logs to server.log for inspection
try {
	const logStream = fs.createWriteStream(path.join(process.cwd(), 'server.log'), { flags: 'a' })
	app.use(morgan('combined', { stream: logStream }))
} catch (e) {
	console.warn('Could not create server.log', e)
}

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', service: 'algovision-backend' })
})

app.use('/api/auth', authRouter)
app.use('/api/visualizations', visualizationsRouter)
app.use('/api/quiz', quizRouter)
app.use('/api/reports', reportsRouter)

const PORT = parseInt(process.env.PORT || '4000', 10)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algovision'

async function start() {
	try {
		await mongoose.connect(MONGO_URI, { dbName: 'algovision' })
		console.log('Connected to MongoDB')

		// Try to bind to PORT, if busy try a few alternate ports
		let tryPort = PORT
		const maxAttempts = 5
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			try {
				await new Promise((resolve, reject) => {
					const server = app.listen(tryPort)
					server.on('listening', () => {
						console.log(`Server running on http://localhost:${tryPort}`)
						resolve(null)
					})
					server.on('error', (err) => reject(err))
				})
				break
			} catch (err) {
				if (err && err.code === 'EADDRINUSE') {
					console.warn(`Port ${tryPort} in use, trying ${tryPort + 1}`)
					tryPort++
					continue
				}
				throw err
			}
		}
	} catch (err) {
		console.error('Failed to start server', err)
		process.exit(1)
	}
}

start()
