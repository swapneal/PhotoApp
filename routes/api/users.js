const express = require('express');

const router = express.Router();

const User = require('../../models/user');

// @route POST api/users/register
// @desc User register
// @access public route
router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        return res.status(400).json({
          username: 'Username already exists'
        })
      } else {
        const newUser = new User({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
        });
        return res.status(200).json({ msg: 'success' });
      }
    })
    .catch(err => console.log('Unique Username Check Error Msg: '+ err))
});

module.exports = router;