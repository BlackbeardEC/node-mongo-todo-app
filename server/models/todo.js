var mongoose = require('mongoose');
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,// validatin - is required
    minlength: 1,// validatin - cannot be an empty string
    trim: true// validatin - removes any empty space at beginning and end
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true

  }
});

module.exports = {Todo};
