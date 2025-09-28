/**
 * Middleware to validate:
 * Case Status
 * Case Priority
 */

const { validStatuses, messages, validPriorities } = require('../constants');

// Validate case status
function validateStatusField(req, res, next) {
    const { status } = req.body;

    // Validate status information from request body
    const statusCap = String(status).toUpperCase(); // convert to uppercase for validation

    if (!status || !validStatuses.includes(statusCap)) {
        return res.status(400).json({ success: false, message: messages.status_invalid });
    }
    next();

}

// Validate case priority
function validatePriorityField(req, res, next) {
    const { priority } = req.body;

    // Validate priority information from request body
    const priorityCap = String(priority).toUpperCase(); // convert to uppercase for validation

    if (!priority ||!validPriorities.includes(priorityCap)) {
        return res.status(400).json({ success: false, message: messages.priority_invalid });
    }
    next();
}

module.exports = {
    validateStatusField,
    validatePriorityField
};