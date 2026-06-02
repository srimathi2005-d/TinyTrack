const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const generateCode = require('../utils/generateCode');

// @desc   Create a short URL
// @route  POST /api/urls
// @access Private
const createUrl = async (req, res) => {
  res.status(501).json({ message: 'Coming in Phase 3' });
};

// @desc   Get all URLs for logged-in user
// @route  GET /api/urls
// @access Private
const getUrls = async (req, res) => {
  res.status(501).json({ message: 'Coming in Phase 3' });
};

// @desc   Delete a URL
// @route  DELETE /api/urls/:id
// @access Private
const deleteUrl = async (req, res) => {
  res.status(501).json({ message: 'Coming in Phase 3' });
};

// @desc   Redirect to original URL
// @route  GET /:shortCode
// @access Public
const redirectUrl = async (req, res) => {
  res.status(501).json({ message: 'Coming in Phase 3' });
};

module.exports = { createUrl, getUrls, deleteUrl, redirectUrl };
