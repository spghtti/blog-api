const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

// TODO: Add error handling
// TODO: Add body validation and sanitization

exports.post_comment = async (req, res, next) => {
  const comment = new Comment({
    user: req.body.user,
    body: req.body.body,
  });

  const post = await Post.findById(req.params.postId);
  await post.comments.push(comment._id);

  post.save((err) => {
    if (err) {
      return next(err);
    }
  });

  comment.save((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.status(200).json(comment.toObject());
};
