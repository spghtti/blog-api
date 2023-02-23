const Post = require('../models/post');
const Comment = require('../models/comment');
const async = require('async');
const { body, validationResult } = require('express-validator');

// TODO: Add error handling
// TODO: Add body validation and sanitization

exports.get_single_comment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).exec();
  return res.status(200).json(comment.toObject());
};

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
        res.json({
          updatedComment,
          success: false,
          msg: 'Failed to update comment',
        });
      } else {
        return res.status(200).json(updatedComment.toObject());
      }
    }
  );
};

exports.delete_comment = (req, res, next) => {
  async.parallel(
    {
      function(callback) {
        Post.findOneAndUpdate(
          { _id: req.params.postId },
          {
            $pull: { comments: req.params.commentId },
          },
          callback
        );
      },
      function(callback) {
        Comment.findByIdAndRemove(req.params.commentId).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      console.log('SUCCESS!!');
      return res.status(200).json('Deleted comment');
    }
  );
};
