const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const generateCode = require('../utils/generateCode');

// Validate URL format
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Detect device type from User-Agent
const getDeviceType = (userAgent = '') => {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    return ua.includes('ipad') ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

// Detect browser from User-Agent
const getBrowser = (userAgent = '') => {
  const ua = userAgent;
  if (/Edg\//.test(ua))     return 'Edge';
  if (/OPR\//.test(ua))     return 'Opera';
  if (/Chrome\//.test(ua))  return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua))  return 'Safari';
  return 'Unknown';
};

// @desc   Create a short URL
// @route  POST /api/urls
// @access Private
const createUrl = async (req, res) => {
  const { originalUrl, customAlias } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ message: 'Please provide a valid URL (must start with http:// or https://)' });
  }

  try {
    let shortCode;

    if (customAlias) {
      // Validate alias: alphanumeric + hyphens only, 3-20 chars
      const aliasRegex = /^[a-zA-Z0-9-]{3,20}$/;
      if (!aliasRegex.test(customAlias)) {
        return res.status(400).json({
          message: 'Alias must be 3-20 characters, letters, numbers, or hyphens only',
        });
      }

      // Check if alias is already taken
      const existing = await Url.findOne({ shortCode: customAlias });
      if (existing) {
        return res.status(409).json({ message: 'This alias is already taken' });
      }

      shortCode = customAlias;
    } else {
      shortCode = await generateCode();
    }

    const url = await Url.create({
      userId: req.user._id,
      originalUrl,
      shortCode,
      clicks: 0,
    });

    res.status(201).json({
      ...url.toObject(),
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating URL' });
  }
};

// @desc   Get all URLs for logged-in user
// @route  GET /api/urls
// @access Private
const getUrls = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = { userId: req.user._id };

    // Search filter on originalUrl or shortCode
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
      ];
    }

    const [urls, total] = await Promise.all([
      Url.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Url.countDocuments(query),
    ]);

    const urlsWithShortUrl = urls.map((url) => ({
      ...url.toObject(),
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    }));

    res.status(200).json({
      urls: urlsWithShortUrl,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching URLs' });
  }
};

// @desc   Delete a URL
// @route  DELETE /api/urls/:id
// @access Private
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Only the owner can delete
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this URL' });
    }

    // Also delete all analytics for this URL
    await Analytics.deleteMany({ urlId: url._id });
    await url.deleteOne();

    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting URL' });
  }
};

// @desc   Redirect to original URL + record analytics
// @route  GET /:shortCode
// @access Public
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Record analytics (fire-and-forget style)
    const userAgent = req.headers['user-agent'] || '';
    Analytics.create({
      urlId: url._id,
      browser: getBrowser(userAgent),
      device: getDeviceType(userAgent),
    }).catch(() => {}); // Don't fail redirect if analytics fails

    // Increment click count
    Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } }).catch(() => {});

    // Redirect to original URL
    return res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error during redirect' });
  }
};

module.exports = { createUrl, getUrls, deleteUrl, redirectUrl };

