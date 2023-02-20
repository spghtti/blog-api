const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 3 },
  body: { type: String, required: true, minLength: 3 },
  date: { type: Date, default: Date.now() },
  isPublished: { type: Boolean, required: true, default: false },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

PostSchema.virtual('url').get(function () {
  return `/blog/post/${this._id}`;
});

// Export model
module.exports = mongoose.model('Post', PostSchema);
