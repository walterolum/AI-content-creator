const express = require('express')
const router = express.Router()
const { generateScript, generateScriptAPI } = require('../services/scriptWriter')
const { authenticate } = require('../middleware/auth')

router.post('/script', authenticate, async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const script = await generateScriptAPI(req.body, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
    })

    res.write(`data: ${JSON.stringify({ script })}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('Script generation error:', error.message)
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate script', error: error.message })
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      res.end()
    }
  }
})

router.post('/script-direct', authenticate, async (req, res) => {
  try {
    const script = generateScript(req.body)
    res.json({ script })
  } catch (error) {
    console.error('Direct script error:', error.message)
    res.status(500).json({ message: 'Failed to generate script', error: error.message })
  }
})

module.exports = router
