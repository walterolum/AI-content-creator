const express = require('express')
const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    // In production, use Supabase Admin API
    res.json({ message: 'Registration successful', user: { email } })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // In production, verify with Supabase
    res.json({ message: 'Login successful', token: 'mock-token' })
  } catch (error) {
    res.status(500).json({ message: 'Login failed' })
  }
})

module.exports = router
