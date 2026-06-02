const express = require('express');
const router = express.Router();
const { createUrl, getUrls, deleteUrl } = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');

// All routes protected
router.post('/', protect, createUrl);
router.get('/', protect, getUrls);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
