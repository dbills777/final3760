const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: String,
  complete: Boolean,
  ingredients: Array,
  directions: String
});
module.exports = mongoose.model('Rec', RecipeSchema);
