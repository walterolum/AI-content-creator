const { body, validationResult } = require('express-validator')

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }
  next()
}

const generateContentRules = [
  body('businessType').notEmpty().withMessage('Business type is required'),
  body('platform').notEmpty().withMessage('Platform is required'),
  body('tone').notEmpty().withMessage('Tone is required'),
  body('goal').notEmpty().withMessage('Goal is required'),
  body('topic').notEmpty().withMessage('Topic is required'),
]

const registerRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

module.exports = { handleValidation, generateContentRules, registerRules }
