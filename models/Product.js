const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Product = mongoose.model("product", ProductSchema);