const express = require('express');

const router = express.Router();

router.get('/test', (req, res) => res.json({
  msg: 'Inside Posts page'
}))

module.exports = router;