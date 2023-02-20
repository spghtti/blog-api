const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.get_allPosts);

router.get('/:postId', postController.get_post);

router.post('/', postController.post_post);

router.put('/', (req, res) => {
  return res.send('PUT HTTP method on post resource');
});

router.delete('/', (req, res) => {
  return res.send('DELETE HTTP method on post resource');
});

router.put('/:postId', (req, res) => {
  return res.send(`PUT HTTP method on post/${req.params.postId} resource`);
});

router.delete('/:postId', (req, res) => {
  return res.send(`DELETE HTTP method on post/${req.params.postId} resource`);
});

module.exports = router;
