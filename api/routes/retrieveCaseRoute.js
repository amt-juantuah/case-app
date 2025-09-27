/**
 * Retrieve case tasks
 */

var express = require('express');
var router = express.Router();

const CaseService = require("../services/caseService.js");

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
router.get('/:id', async (req, res, next) => {
    try {
        const caseId = req.params.id; // string id (UUID)

        const caseData = await CaseService.getCaseById(caseId);

        if (caseData) {
            res.json({ success: true, data: caseData });
        } else {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;