const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')

// GET /api/content - Get all content for user
router.get('/', authenticate, async (req, res) => {
  try {
    // In production, fetch from Supabase
    res.json({ content: [] })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch content' })
  }
})

// POST /api/content - Save content
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, platform, tags } = req.body
    // In production, save to Supabase
    res.json({ message: 'Content saved', id: 'mock-id' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save content' })
  }
})

// DELETE /api/content/:id - Delete content
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // In production, delete from Supabase
    res.json({ message: 'Content deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete content' })
  }
})

module.exports = router
