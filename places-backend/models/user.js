const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  places: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Place',
      default: [],
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
