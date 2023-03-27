const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

exports.get_posts = (req, res, next) => {
  Post.find({})
    .sort({ date: -1 })
    .exec(function (err, posts) {
      if (err) {
        return res.status(500).json({ error: err, status: 500 });
      } else {
        posts = posts.filter((post) => post.isPublished);
        return res.status(200).json(posts);
      }
    });
};

exports.get_allPosts = (req, res, next) => {
  Post.find({})
    .sort({ date: -1 })
    .exec(function (err, posts) {
      if (err) {
        return res.status(500).json({ error: err, status: 500 });
      } else {
        posts = posts.map((o) => o.toObject());
        return res.status(200).json(posts);
      }
    });
};

exports.get_single_post = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { views: 1 },
    })
      .populate({
        path: 'comments',
        model: 'Comment',
      })
      .exec();
    if (!post)
      return res.status(404).json({
        error: 'Post not found',
        status: 404,
        post: req.params.postId,
      });
    return res.status(200).json(post.toObject());
  } catch (err) {
    return next(err);
  }
};

exports.post_create_post = [
  body('title')
    .trim()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .escape(),
  body('body')
    .trim()
    .isString()
    .withMessage('Body must be a string')
    .isLength({ min: 3 })
    .withMessage('Body must be at least 3 characters')
    .escape(),
  body('preview')
    .trim()
    .isString()
    .withMessage('Preview must be a string')
    .isLength({ min: 3 })
    .withMessage('Preview must be at least 3 characters')
    .escape(),
  body('date')
    .optional({ checkFalsy: true })
    .trim()
    .isDate()
    .withMessage('Date must be a date')
    .escape(),
  body('isPublished')
    .trim()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .escape(),
  body('tags.*')
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage('Tag must be a string')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors, status: 400 });
    }

    const post = new Post({
      title: req.body.title,
      preview: req.body.preview,
      tags: req.body.tags,
      body: req.body.body,
      date: req.body.date,
      isPublished: req.body.isPublished,
    });

    post.save((err) => {
      if (err) {
        return res.status(500).json({ error: err, status: 500, post: post });
      }
      return res.status(200).json(post.toObject());
    });
  },
];

exports.put_update_post = [
  body('title')
    .trim()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .escape(),
  body('preview')
    .trim()
    .isString()
    .withMessage('Preview must be a string')
    .isLength({ min: 3 })
    .withMessage('Preview must be at least 3 characters')
    .escape(),
  body('body')
    .trim()
    .isString()
    .withMessage('Body must be a string')
    .isLength({ min: 3 })
    .withMessage('Body must be at least 3 characters')
    .escape(),
  body('tags.*')
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage('Tag must be a string')
    .escape(),
  body('date')
    .optional({ checkFalsy: true })
    .trim()
    .isDate()
    .withMessage('Date must be a date')
    .escape(),
  body('isPublished')
    .trim()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors, status: 400 });
    }

    const update = {
      title: req.body.title,
      preview: req.body.preview,
      body: req.body.body,
      isPublished: req.body.isPublished,
      tags: req.body.tags,
      updated: Date.now(),
    };

    Post.findByIdAndUpdate(
      req.params.postId,
      update,
      { returnDocument: 'after' },
      (err, updatedPost) => {
        if (err) {
          return res
            .status(500)
            .json({ error: err, status: 500, post: update });
        }
        if (updatedPost === null) {
          return res
            .status(404)
            .json({ error: 'Not found', status: 404, post: update });
        }
        return res.status(200).json(updatedPost.toObject());
      }
    );
  },
];

exports.delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.params.postId, (err, deletedPost) => {
    if (err) {
      return res.status(500).json({
        error: err,
        status: 500,
        post: req.params.postId,
      });
    }
    if (deletedPost === null) {
      return res.status(404).json({
        error: 'Not found',
        status: 404,
        post: req.params.postId,
      });
    }
    return res.status(200).json({ message: 'Post deleted' });
  });
};
