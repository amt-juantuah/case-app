/**
 * Retrieve case tasks
 */

var express = require('express');
var router = express.Router();

const CaseService = require("../services/caseService.js");
const { messages } = require('../constants.js');
const validateCaseExists = require('../middleware/validateCaseExists');
const validateUuidParam = require('../middleware/validateUuidParam');


// Retrieve all cases from the database
router.get('/', async (req, res, next) => {
    try {
        const cases = await CaseService.getAllCases();

        res.json({ success: true, data: cases });

    } catch (error) {
        next(error);
    }
});

// Retrieve a case by its ID from the database
router.get('/:id', validateUuidParam, validateCaseExists, async (req, res, next) => {
    try {
        res.json({ success: true, message: messages.case_found, data: req.case });
    } catch (error) {
        next(error);
    }
});

module.exports = router;