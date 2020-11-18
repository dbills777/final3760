const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    complete: Boolean,
    ingredients: Array,
    shopping: [
      {
        item: String,
        quantity: Number,
        complete: Boolean,
      },
    ],
    directions: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Rec', RecipeSchema);
