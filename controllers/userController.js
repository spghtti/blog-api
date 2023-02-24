const User = require('../models/user');

const async = require('async');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const passport = require('passport');

// TODO: Add error handling
// TODO: Add body validation and sanitization

exports.get_allUsers = (req, res, next) => {
  User.find({})
    .select({ password: 0, date_created: 0 })
    .exec(function (err, users) {
      if (err) {
        return res.status(500).json({ error: err, status: 500 });
      }
      if (!users) {
        return res.status(404).json({ error: 'No users found', status: 404 });
      }
      users = users.map((o) => o.toObject());
      return res.status(200).json(users);
    });
};

exports.get_single_user = async (req, res, next) => {
  const user = await User.findById(req.params.userId).exec();
  if (!user)
    return res
      .status(404)
      .json({ error: 'No user found', status: 404, user: req.params.userId });
  return res.status(200).json(user.toObject());
};

exports.post_create_user = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  user.save((err) => {
    if (err) {
      return res.status(500).json({ error: err, status: 500, user: user });
    }
  });
  return res.status(200).json(user.toObject());
};

exports.put_update_user = (req, res, next) => {
  const update = {
    username: req.body.username,
    email: req.body.email,
  };

  User.findByIdAndUpdate(
    req.params.userId,
    update,
    { returnDocument: 'after' },
    (err, updatedUser) => {
      if (err) {
        return res.status(500).json({ error: err, status: 500, user: update });
      }
      if (updatedUser === null) {
        return res
          .status(404)
          .json({ error: 'User not found', status: 404, user: update });
      }
      return res.status(200).json(updatedUser.toObject());
    }
  );
};

exports.delete_user = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: err, status: 500, user: req.params.userId });
    }
    return res.status(200).json({ message: 'User deleted' });
  });
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
