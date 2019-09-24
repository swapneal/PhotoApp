const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


const router = express.Router();

const User = require('../../models/user');

// @route POST api/users/register
// @desc User register
// @access public route
router.post('/register', (req, res) => {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
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
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username
  }).then(user => {
    if (!user) {
      errors.username = 'Invalid Username';
      return res.status(400).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        errors.password = 'Password does not match';
        return res.status(400).json(errors);
      }
      const payload = {
        id: user.id,
        name: user.name
      };
      jwt.sign(payload, keys.secretOrKey, {
        expiresIn: 3600
      }, (err, token) => {
        if (err) throw err;
        return res.json({
          success: true,
          token: 'Bearer ' + token
        });
      });
    }).catch(err => console.log('Error in password comparision: ' + err));
  }).catch(err => console.log('Error in username: ' + err));
})

// @route GET api/users/current
// @desc return current page
// @access private route which takes 3 parameters of route name, passport authentication, if authenticated then arrow function
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    name: req.user.name
  });
});


module.exports = router;