const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const passport = require('../config/passport');
const verifyAdmin = require('../config/verifyAdmin');

/* GET users listing. */

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  userController.get_allUsers
);

router.post('/', userController.post_create_user);

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  userController.get_single_user
);

router.put(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  userController.put_update_user
);

router.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  userController.delete_user
);

module.exports = router;
