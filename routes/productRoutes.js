const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Routes
router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;