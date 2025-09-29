/**
 * Create case task
 */

const { validStatuses, messages, validPriorities } = require('../constants');

var express = require('express');
var router = express.Router();


const CaseService = require("../services/caseService.js");


// Create a new task
router.post('/', async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        // Validate information from request body
        if (!title || !dueDate) {
            return res.status(400).json({ success: false, message: messages.title_dueDate_required });
        }

        const statusCap = String(status).toUpperCase(); // convert to uppercase for validation
        const priorityCap = String(priority).toUpperCase(); // convert to uppercase for validation

        if (statusCap && !validStatuses.includes(statusCap)) {
            return res.status(400).json({ success: false, error: messages.status_invalid });
        }

        if (priorityCap && !validPriorities.includes(priorityCap)) {
            return res.status(400).json({ success: false, error: messages.priority_invalid });
        }

        const newCaseData = {
            title,
            description: description || '',
            status: statusCap || 'OPEN',
            priority: priorityCap || 'LOW',
            dueDate: new Date(dueDate)
        };

        const newCase = await CaseService.createCase(newCaseData);

        res.status(201).json({ success: true, data: newCase, message: messages.case_created });

    } catch (error) {
        next(error);
    }

});

module.exports = router;