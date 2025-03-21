const Product = require("../models/Product");

exports.createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

exports.getProducts = async () => {
  return await Product.find();
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true });
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};