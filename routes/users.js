const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// let users = {
//   1: {
//     id: '1',
//     username: 'Robin Wieruch',
//   },
//   2: {
//     id: '2',
//     username: 'Dave Davids',
//   },
// };

// let messages = {
//   1: {
//     id: '1',
//     text: 'Hello World',
//     userId: '1',
//   },
//   2: {
//     id: '2',
//     text: 'By World',
//     userId: '2',
//   },
// };

/* GET users listing. */

router.get('/', userController.get_allUsers);

router.get('/:userId', userController.get_user);

router.post('/', (req, res) => {
  return res.send('POST HTTP method on user resource');
});

router.put('/', (req, res) => {
  return res.send('PUT HTTP method on user resource');
});

router.delete('/', (req, res) => {
  return res.send('DELETE HTTP method on user resource');
});

router.put('/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});

router.delete('/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

module.exports = router;
