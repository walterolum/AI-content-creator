const express = require('express')
const router = express.Router()
const { generateContent, rewriteContent, generateCalendar } = require('../services/aiService')
const { authenticate } = require('../middleware/auth')
const { generateContentRules, handleValidation } = require('../middleware/validate')

// POST /api/ai/generate
router.post('/generate', authenticate, generateContentRules, handleValidation, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    await generateContent(req.body, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
    })

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('AI generation error:', error)
    res.status(500).json({ message: 'Failed to generate content' })
  }
})

// POST /api/ai/rewrite
router.post('/rewrite', authenticate, async (req, res) => {
  try {
    const { text, action, targetLanguage } = req.body
    if (!text || !action) {
      return res.status(400).json({ message: 'Text and action are required' })
    }

    const result = await rewriteContent(text, action, targetLanguage)
    res.json({ content: result })
  } catch (error) {
    console.error('AI rewrite error:', error)
    res.status(500).json({ message: 'Failed to rewrite content' })
  }
})

// POST /api/ai/calendar
router.post('/calendar', authenticate, async (req, res) => {
  try {
    const { businessType, platform, tone, duration, topic } = req.body
    if (!businessType || !platform || !duration) {
      return res.status(400).json({ message: 'Business type, platform, and duration are required' })
    }

    const result = await generateCalendar({ businessType, platform, tone, duration, topic })
    res.json({ calendar: result })
  } catch (error) {
    console.error('AI calendar error:', error)
    res.status(500).json({ message: 'Failed to generate calendar' })
  }
})

module.exports = router
