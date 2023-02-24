const Post = require('../models/post');
const Comment = require('../models/comment');
const async = require('async');
const { body, validationResult } = require('express-validator');

// TODO: Add error handling
// TODO: Add body validation and sanitization

exports.get_single_comment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).exec();
  if (!comment)
    return res.status(404).json({
      error: 'Comment not found',
      status: 404,
      comment: req.params.commentId,
    });
  return res.status(200).json(comment.toObject());
};

exports.post_comment = async (req, res, next) => {
  const comment = new Comment({
    user: req.body.user,
    body: req.body.body,
  });

  const post = await Post.findById(req.params.postId);
  if (!post)
    return res
      .status(404)
      .json({ error: 'Post not found', status: 404, post: req.params.postId });

  await post.comments.push(comment._id);

  post.save((err) => {
    if (err) {
      return res.status(500).json({ error: err, status: 500 });
    }
  });

  comment.save((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: err, status: 500, comment: comment });
    }
  });
  return res.status(201).json(comment.toObject());
};

exports.put_update_comment = (req, res, next) => {
  const update = {
    body: req.body.body,
    date: req.body.date,
  };

  Comment.findByIdAndUpdate(
    req.params.commentId,
    update,
    { returnDocument: 'after' },
    (err, updatedComment) => {
      if (err) {
        return res
          .status(500)
          .json({ error: err, status: 500, comment: update });
      }
      if (updatedComment === null) {
        return res
          .status(404)
          .json({ error: 'Not found', status: 404, comment: update });
      }
      return res.status(201).json(updatedComment.toObject());
    }
  );
};

exports.delete_comment = (req, res, next) => {
  async.parallel(
    {
      post(callback) {
        Post.findOneAndUpdate(
          { _id: req.params.postId },
          {
            $pull: { comments: req.params.commentId },
          },
          callback
        );
      },
      comment(callback) {
        Comment.findByIdAndRemove(req.params.commentId).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'err', status: 500, comment: req.params.commentId });
      }
      if (results.post === null || results.comment === null) {
        return res.status(404).json({
          error: 'Not found',
          status: 404,
          comment: req.params.commentId,
          post: req.params.postId,
        });
      }
      return res.status(200).json('Deleted comment');
    }
  );
};
