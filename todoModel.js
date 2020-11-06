const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: String,
  complete: Boolean,
  cat: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});
module.exports = mongoose.model('Todo',TodoSchema)