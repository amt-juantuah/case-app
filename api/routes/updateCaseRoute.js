/**
 * Update :
 * - Update the status or priority of an existing case in the database.
 */

const { validStatuses, messages, validPriorities } = require('../constants');
const CaseService = require("../services/caseService.js");
const validateCaseExists = require('../middleware/validateCaseExists');
const validateUuidParam = require('../middleware/validateUuidParam');

var express = require('express');
var router = express.Router();

// Update the status of a case
router.patch('/:id/status', validateUuidParam, validateCaseExists, async (req, res, next) => {
    try {
        // const caseId = req.params.id; // string id (UUID)
        const { status } = req.body;

        // Validate status information from request body
        const statusCap = String(status).toUpperCase(); // convert to uppercase for validation

        if (!status || !validStatuses.includes(statusCap)) {
            return res.status(400).json({ success: false, message: messages.status_invalid });
        }

        const updatedCaseData = {
            status: statusCap,
        };

        const updatedCase = await CaseService.updateCase(req.case.id, updatedCaseData);

        if (updatedCase) {
            res.json({ success: true, data: updatedCase, message: messages.case_status_updated });
        } else {
            return res.status(404).json({ success: false, message: messages.case_not_found });
        }
    } catch (error) {
        next(error);
    }
});


// Update the priority of a case
router.patch('/:id/priority', validateUuidParam, validateCaseExists, async (req, res, next) => {
    try {
        // const caseId = req.params.id; // string id (UUID)
        const { priority } = req.body;

        // Validate priority information from request body
        const priorityCap = String(priority).toUpperCase(); // convert to uppercase for validation

        if (!priority || !validPriorities.includes(priorityCap)) {
            return res.status(400).json({ success: false, error: messages.priority_invalid });
        }

        const updatedCaseData = {
            priority: priorityCap,
        };

        const updatedCase = await CaseService.updateCase(req.case.id, updatedCaseData);

        if (updatedCase) {
            res.json({ success: true, data: updatedCase, message: messages.case_priority_updated });
        } else {
            return res.status(404).json({ success: false, message: messages.case_not_found });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;