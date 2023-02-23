const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', (req, res) => {
  return res.json({ message: 'Welcome to my blog API' });
});

module.exports = router;
