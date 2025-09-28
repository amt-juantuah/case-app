const { validate: isUuid } = require('uuid');

function validateUuidParam(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid UUID format',
    });
  }

  next();
}

module.exports = validateUuidParam;
