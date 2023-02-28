const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', (req, res) => {
  return res.json({ message: 'Welcome to my blog API' });
});

router.post('/login', userController.user_login_post);

router.post('/register', userController.user_register_post);

module.exports = router;
