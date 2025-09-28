/**
 * Middleware: 
 * Validate case existence by ID before processing requests
 */

const CaseService = require("../services/caseService.js");
const { messages } = require('../constants');



async function validateCaseExists(req, res, next) {
    try {
        const caseId = req.params.id; // string id (UUID)
        const caseFound = await CaseService.getCaseById(caseId);

        if (!caseFound) {
            return res.status(404).json({ success: false, message: messages.case_not_found });
        }

        req.case = caseFound; // Store the case object in the request object for use in other routes
        next();

    } catch (error) {
        next(error);
    }
}

module.exports = validateCaseExists;