const Post = require('../models/post');
const Comment = require('../models/comment');

const async = require('async');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const passport = require('passport');

// TODO: Add error handling
// TODO: Add body validation and sanitization

exports.get_allPosts = (req, res, next) => {
  Post.find({}).exec(function (err, posts) {
    if (err) {
      return res.status(500).json({ error: err, status: 500 });
    } else {
      posts = posts.map((o) => o.toObject());
      return res.status(200).json(posts);
    }
  });
};

exports.get_single_post = async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: [
        {
          path: 'user',
          model: 'User',
          select: {
            date_created: 0,
            password: 0,
            email: 0,
            password: 0,
            date: 0,
          },
        },
      ],
    })
    .exec();
  if (!post)
    return res.status(404).json({
      error: 'Comment not found',
      status: 404,
      post: req.params.postId,
    });
  return res.status(200).json(post.toObject());
};

exports.post_create_post = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    date: req.body.date,
    isPublished: req.body.isPublished,
  });

  post.save((err) => {
    if (err) {
      return res.status(500).json({ error: err, status: 500, post: post });
    }
  });
  return res.status(200).json(post.toObject());
};

exports.put_update_post = (req, res, next) => {
  const update = {
    title: req.body.title,
    body: req.body.body,
    date: req.body.date,
    isPublished: req.body.isPublished,
  };

  Post.findByIdAndUpdate(
    req.params.postId,
    update,
    { returnDocument: 'after' },
    (err, updatedPost) => {
      if (err) {
        return res.status(500).json({ error: err, status: 500, post: update });
      }
      if (updatedPost === null) {
        return res
          .status(404)
          .json({ error: 'Not found', status: 404, post: update });
      }
      return res.status(200).json(updatedPost.toObject());
    }
  );
};

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
