const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../../models/user');

// @route POST api/users/register
// @desc User register
// @access public route
router.post('/register', (req, res) => {
  User.findOne({
      username: req.body.username
    })
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
        // return res.status(200).json({ msg: 'success' });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => res.json(user)).catch(err => console.log('Error in password hash: ' + err));
          });
        });
      }
    })
    .catch(err => console.log('Unique Username Check Error Msg: ' + err))
});

// @route POST api/users/login
// @desc User Login page
// @access public route
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        msg: 'Invalid Username'
      })
    }
  }).catch(err => console.log('Error in username: ' + err))
})


module.exports = router;