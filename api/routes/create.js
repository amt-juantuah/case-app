/**
 * Create tasks
 */

var express = require('express');
var router = express.Router();

/** 
 * Create a new task
*/
router.post('/', (req, res, next) => {
    res.send('A new task is to be created');
});

module.exports = router;