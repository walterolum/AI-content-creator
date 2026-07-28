const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const config = require('./config')

const app = express()

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.vercel.app'
    : 'http://localhost:5173',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/ai', require('./routes/ai'))
app.use('/api/content', require('./routes/content'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
