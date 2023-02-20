const Post = require('../models/post');
const Comment = require('../models/comment');

const async = require('async');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const passport = require('passport');

exports.get_allPosts = async (req, res, next) => {
  Post.find({}).exec(function (err, posts) {
    posts = posts.map((o) => o.toObject());
    return res.status(200).json(posts);
  });
};

exports.get_post = async (req, res, next) => {
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
  return res.status(200).json(post.toObject());
};

exports.post_post = async (req, res, next) => {
  // TODO: Body validation and sanitization

  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    date: req.body.date,
    isPublished: req.body.isPublished,
  });

  post.save((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.status(200).json(post.toObject());
};
