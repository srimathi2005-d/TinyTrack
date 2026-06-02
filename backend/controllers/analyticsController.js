const Analytics = require('../models/Analytics');
const Url = require('../models/Url');

// @desc   Get analytics for a specific URL
// @route  GET /api/analytics/:urlId
// @access Private
const getAnalytics = async (req, res) => {
  try {
    const url = await Url.findById(req.params.urlId);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Only owner can view analytics
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these analytics' });
    }

    const analytics = await Analytics.find({ urlId: url._id }).sort({ timestamp: -1 });

    // Last visited timestamp
    const lastVisited = analytics.length > 0 ? analytics[0].timestamp : null;

    // 10 most recent visits
    const recentVisits = analytics.slice(0, 10).map((a) => ({
      timestamp: a.timestamp,
      browser: a.browser,
      device: a.device,
    }));

    // Daily click chart — last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = 0;
    }

    analytics
      .filter((a) => new Date(a.timestamp) >= sevenDaysAgo)
      .forEach((a) => {
        const key = new Date(a.timestamp).toISOString().split('T')[0];
        if (dailyMap[key] !== undefined) dailyMap[key]++;
      });

    const dailyClicks = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // Device breakdown
    const deviceCounts = analytics.reduce((acc, a) => {
      acc[a.device] = (acc[a.device] || 0) + 1;
      return acc;
    }, {});

    // Browser breakdown
    const browserCounts = analytics.reduce((acc, a) => {
      acc[a.browser] = (acc[a.browser] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      totalClicks: url.clicks,
      lastVisited,
      recentVisits,
      dailyClicks,
      deviceBreakdown: deviceCounts,
      browserBreakdown: browserCounts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};

module.exports = { getAnalytics };
