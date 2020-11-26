const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  city: String,
  profilePicture: String
});

ProductSchema.plugin(passportLocalMongoose);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;