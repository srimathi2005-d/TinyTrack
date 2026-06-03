const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/google
router.post('/google', googleAuth);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

module.exports = router;
