var express = require('express');
var router = express.Router();

router.put('/', (req, res, next) => {
    res.send('task is to be updated');
});

module.exports = router;