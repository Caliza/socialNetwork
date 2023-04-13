const { Schema, model } = require('mongoose');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
      }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id:false
  }
);

const User = model('user', userSchema);

module.exports = User;
