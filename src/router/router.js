const express = require('express')
const router = express.Router();

// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => {
  res.send('smart employee backend')
})

module.exports = router;