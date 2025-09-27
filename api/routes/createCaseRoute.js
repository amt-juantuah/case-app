/**
 * Create case tasks
 */

const { validStatuses, messages, validPriorities } = require('../constants');

var express = require('express');
var router = express.Router();


const CaseService = require("../services/caseService.js");


// Create a new task
router.post('/', async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({ success: false, message: messages.title_dueDate_required });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: messages.status_invalid });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ success: false, error: messages.priority_invalid });
        }

        const newCaseData = {
            title,
            description: description || '',
            status: status || 'OPEN',
            priority: priority || 'LOW',
            dueDate: new Date(dueDate)
        };

        const newCase = await CaseService.createCase(newCaseData);

        res.status(201).json({ success: true, data: newCase });

    } catch (error) {
        next(error);
    }

});

module.exports = router;