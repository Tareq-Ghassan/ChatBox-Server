const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: {
      code: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true,
      }
    },
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: "" 
  }
});

module.exports = mongoose.model('User', userSchema);