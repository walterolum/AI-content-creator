const config = require('../config')

// Mock auth middleware - replace with real Supabase verification
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  // In production, verify the JWT with Supabase
  // For now, mock the user
  req.user = {
    id: 'mock-user-id',
    email: 'user@example.com',
    role: 'user',
  }

  next()
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = { authenticate, requireAdmin }
