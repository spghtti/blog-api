const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 30 },
  password: { type: String, required: true, minLength: 5, maxLength: 100 },
  email: { type: String, required: true, minLength: 4, maxLength: 100 },
  date_created: { type: Date, default: Date.now() },
  isAdmin: { type: Boolean, required: true, default: false },
});

UserSchema.virtual('toJSON').get(function () {
  return this.toJSON();
});

// Export model
module.exports = mongoose.model('User', UserSchema);
