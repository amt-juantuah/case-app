/**
 * Middleware to validate:
 * API key
 */

const { messages } = require('../constants');

// Validate API key
function validateApiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey) {
    return res.status(401).json({ success: false, message: messages.missing_api_key });
  }

  if (clientKey !== process.env.API_KEY) {
    return res.status(403).json({ success: false, message: messages.invalid_api_key });
  }

  next();
}


module.exports = {
    validateApiKey
};