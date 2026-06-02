const Url = require('../models/Url');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 6;

// Generate a random 6-character alphanumeric code
const generateCode = async () => {
  let code;
  let exists = true;

  // Keep generating until we get a unique code
  while (exists) {
    code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    // Check uniqueness in DB
    exists = await Url.findOne({ shortCode: code });
  }

  return code;
};

module.exports = generateCode;
