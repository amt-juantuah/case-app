var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send('task are to be retrieved');
});

module.exports = router;