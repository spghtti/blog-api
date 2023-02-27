const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res) => {
  return res.json({ message: 'Welcome to my blog API' });
});

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: 'Incorrect Username or Password',
        user,
      });
    }

    jwt.sign(
      { _id: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' },
      (err, token) => {
        if (err) return res.status(400).json(err);
        res.json({
          token: token,
          user: { _id: user._id, username: user.username },
        });
      }
    );
  })(req, res);
});

module.exports = router;
