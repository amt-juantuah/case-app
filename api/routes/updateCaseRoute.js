/**
 * Update :
 * - Update the status or priority of an existing case in the database.
 */

const { validStatuses, messages, validPriorities } = require('../constants');
const CaseService = require("../services/caseService.js");
const validateCaseExists = require('../middleware/validateCaseExists');
const validateUuidParam = require('../middleware/validateUuidParam');

var express = require('express');
const { validateStatusField, validatePriorityField } = require('../middleware/validateStatusAndPriority.js');
var router = express.Router();

// Update the status of a case
router.patch('/:id/status', validateUuidParam, validateStatusField ,validateCaseExists, async (req, res, next) => {
    try {
        const { status } = req.body;

        const statusCap = String(status).toUpperCase(); // convert to uppercase for validation

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
router.patch('/:id/priority', validateUuidParam, validatePriorityField ,validateCaseExists, async (req, res, next) => {
    try {
        const { priority } = req.body;

        const priorityCap = String(priority).toUpperCase(); // convert to uppercase for validation


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