const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  body: { type: String, required: true, minLength: 3 },
  date: { type: Date, default: Date.now() },
});

// Export model
module.exports = mongoose.model('User', CommentSchema);
