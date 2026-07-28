const express = require('express')
const router = express.Router()
const { generateContent, rewriteContent, generateCalendar } = require('../services/aiService')
const { authenticate } = require('../middleware/auth')
const { generateContentRules, handleValidation } = require('../middleware/validate')

// Test endpoint - no auth required
router.post('/test', async (req, res) => {
  try {
    console.log('Test endpoint called')
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    await generateContent({
      businessType: 'restaurant',
      platform: 'instagram',
      tone: 'friendly',
      goal: 'engagement',
      audience: 'everyone',
      length: 'medium',
      language: 'english',
      topic: 'Summer menu launch',
    }, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
    })

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('Test generation error:', error.message)
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate content', error: error.message })
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      res.end()
    }
  }
})

// POST /api/ai/generate
router.post('/generate', authenticate, generateContentRules, handleValidation, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    await generateContent(req.body, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
    })

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('AI generation error:', error.message)
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate content', error: error.message })
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      res.end()
    }
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
    console.error('AI rewrite error:', error.message)
    res.status(500).json({ message: 'Failed to rewrite content', error: error.message })
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
    console.error('AI calendar error:', error.message)
    res.status(500).json({ message: 'Failed to generate calendar', error: error.message })
  }
})

module.exports = router
