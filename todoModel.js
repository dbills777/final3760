const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  recipe: String,
  complete: Boolean,
  cat: String,
  ingredients: Array,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});
module.exports = mongoose.model('Rec', RecipeSchema);
