/**
 * Delete/erase:
 * Delete a specific case from the database by ID.
 */

var express = require('express');
var router = express.Router();

const CaseService = require("../services/caseService.js");
const { messages, validStatuses } = require('../constants');
const validateCaseExists = require('../middleware/validateCaseExists')
const validateUuidParam = require('../middleware/validateUuidParam')

// Delete a specific case by its ID
router.delete('/:id', validateUuidParam, validateCaseExists, async (req, res, next) => {
    try {
        // Delete the case from the database
        const deletedCase = await CaseService.deleteCase(req.case.id);

        // Return success message
        res.json({ success: true, data: deletedCase, message: messages.case_deleted });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;
