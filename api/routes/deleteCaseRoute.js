var express = require('express');
var router = express.Router();

router.delete('/', (req, res, next) => {
    res.send('task is to be deleted');
});

module.exports = router;
