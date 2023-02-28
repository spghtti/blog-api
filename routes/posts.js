const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

const passport = require('../config/passport');
const verifyAdmin = require('../config/verifyAdmin');

router.get('/', postController.get_allPosts);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  postController.post_create_post
);

router.get('/:postId', postController.get_single_post);

router.put(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  postController.put_update_post
);

router.post(
  '/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  commentController.post_comment
);

router.get(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  commentController.get_single_comment
);

router.put(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  commentController.put_update_comment
);

router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  postController.delete_post
);

router.delete(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  verifyAdmin,
  commentController.delete_comment
);

module.exports = router;
