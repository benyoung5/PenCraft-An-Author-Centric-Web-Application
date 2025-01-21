const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  avatar: { type: String, default: '' },
  posts: { type: Number, default: 0}
}, {
  timestamps: true
});

// Create the model from the schema and export it
const User = model('User', userSchema);
module.exports = User;
