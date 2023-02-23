const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.get('/', postController.get_allPosts);

router.post('/', postController.post_create_post);

router.get('/:postId', postController.get_single_post);

router.put('/:postId', postController.put_update_post);

router.post('/:postId/comments', commentController.post_comment);

router.get(
  '/:postId/comments/:commentId',
  commentController.get_single_comment
);

router.put(
  '/:postId/comments/:commentId',
  commentController.put_update_comment
);

router.delete('/:postId', postController.delete_post);

router.delete('/:postId/comments/:commentId', commentController.delete_comment);

module.exports = router;
