const Post = require('../models/post');
const Comment = require('../models/comment');
const async = require('async');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, validationResult } = require('express-validator');

exports.get_single_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment)
      return res.status(404).json({
        error: 'Comment not found',
        status: 404,
        comment: req.params.commentId,
      });
    return res.status(200).json(comment.toObject());
  } catch (err) {
    return next(err);
  }
};

exports.post_comment = [
  body('body')
    .trim()
    .isString()
    .withMessage('Body must be a string')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Body name must be 3-1,000 characters')
    .escape(),
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 40 })
    .withMessage('Body name must be 3-40 characters')
    .escape(),
  body('email')
    .trim()
    .isString()
    .withMessage('Email must be a string')
    .isEmail()
    .withMessage('Email must be an email address')
    .isLength({ min: 3, max: 40 })
    .withMessage('Email name must be 3-40 characters')
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors, status: 400 });
    }
    const comment = new Comment({
      name: req.body.name,
      email: req.body.email,
      body: req.body.body,
    });

    const post = await Post.findById(req.params.postId);
    if (!post)
      return res.status(404).json({
        error: 'Post not found',
        status: 404,
        post: req.params.postId,
      });

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
      return res.status(201).json(comment.toObject());
    });
  },
];

exports.put_update_comment = [
  body('body')
    .trim()
    .isString()
    .withMessage('Body must be a string')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Body name must be 3-1,000 characters')
    .escape(),
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 40 })
    .withMessage('Body name must be 3-40 characters')
    .escape(),
  body('email')
    .trim()
    .isString()
    .withMessage('Email must be a string')
    .isEmail()
    .withMessage('Email must be an email address')
    .isLength({ min: 3, max: 40 })
    .withMessage('Email name must be 3-40 characters')
    .escape(),
  body('date').trim().isDate().withMessage('Date must be a date').escape(),
  (req, res, next) => {
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors, status: 400 });
    }

    const update = {
      name: req.body.name,
      email: req.body.email,
      body: req.body.body,
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
  },
];

exports.delete_comment = (req, res, next) => {
  async.parallel(
    {
      post(callback) {
        Post.findOneAndUpdate({ _id: req.params.postId }).exec(callback);
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
      results.post.comments.pull({ _id: req.params.commentId });
      results.post.save();
      return res.status(200).json('Deleted comment');
    }
  );
};
