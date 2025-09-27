/**
 * Create case tasks
 */

var express = require('express');
var router = express.Router();

const CaseService = require("../services/caseService.js");


// Create a new task
router.post('/', async (req, res, next) => {
    try {
        const newCaseData = req.body;

        const newCase = await CaseService.createCase(newCaseData);

        res.json({ success: true, data: newCase });

    } catch (error) {
        next(error);
    }

});

module.exports = router;