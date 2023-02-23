const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */

router.get('/', userController.get_allUsers);

router.post('/', userController.post_create_user);

router.get('/:userId', userController.get_single_user);

router.put('/:userId', userController.put_update_user);

router.delete('/', (req, res) => {
  return res.send('DELETE HTTP method on user resource');
});

router.put('/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});

router.delete('/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

router.delete('/:userId', userController.delete_user);

module.exports = router;
