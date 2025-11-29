var express = require('express');
const { messages } = require('../constants');
var router = express.Router();

/* Login */
router.post('/login', async (req, res) => {

  const { username, password } = req.body;

  if (
    username === process.env.DEMO_USERNAME && 
    password === process.env.DEMO_PASSWORD
  ) {
    
    // Return success data
    return res.json({ success: true, user: { username }, message: messages.login_success});
  }
  // login failed
  else return res.status(401).json({ success: false,fails: {username, password}, expected: {username: process.env.DEMO_USERNAME, password: process.env.DEMO_PASSWORD}, message: messages.invalid_credentials });
})

module.exports = router;
