// @desc   Get analytics for a URL
// @route  GET /api/analytics/:urlId
// @access Private
const getAnalytics = async (req, res) => {
  res.status(501).json({ message: 'Coming in Phase 5' });
};

module.exports = { getAnalytics };
