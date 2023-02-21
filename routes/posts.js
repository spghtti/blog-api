const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.get('/', postController.get_allPosts);

router.post('/', postController.post_post);

router.get('/:postId', postController.get_post);

router.put('/:postId', postController.put_post);

router.post('/:postId/comments', commentController.post_comment);

router.delete('/', (req, res) => {
  return res.send('DELETE HTTP method on post resource');
});

router.delete('/:postId', (req, res) => {
  return res.send(`DELETE HTTP method on post/${req.params.postId} resource`);
});

module.exports = router;
