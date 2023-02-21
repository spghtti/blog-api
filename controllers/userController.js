const User = require('../models/user');

const async = require('async');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const passport = require('passport');

// TODO: Add error handling
// TODO: Add body validation and sanitization

exports.get_allUsers = async (req, res, next) => {
  User.find({})
    .select({ password: 0, date_created: 0 })
    .exec(function (err, users) {
      users = users.map((o) => o.toObject());
      return res.status(200).json(users);
    });
};

exports.get_user = async (req, res, next) => {
  const user = await User.findById(req.params.userId).exec();
  return res.status(200).json(user.toObject());
};

exports.post_user = async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  user.save((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.status(200).json(user.toObject());
};

// exports.user_login_get = [
//   (req, res, next) => {
//     passport.authenticate('local', { session: false }),
//       res.render('login', { title: 'Log In', user: req.user });
//   },
// ];

// exports.user_login_post = async (req, res, next) => {
//   passport.authenticate('local', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: 'Something is not right',
//         user: user,
//       });
//     }

//     req.login(user, { session: false }, (err) => {
//       if (err) {
//         res.send(err);
//       }

//       const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
//       return res.json({ user, token });
//     });
//   })(req, res);
// };
