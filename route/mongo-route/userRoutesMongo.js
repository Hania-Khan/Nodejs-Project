const express = require("express");
const { authenticate } = require("../../middleware/authMiddleware");
const {
  createUser,
  loginUser,
  replaceUser,
  updateUser,
  getUser,
  getUserById,
  deleteUserById,
} = require("../../controller/mongo/userControllerMongo");

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.put("/replace", authenticate, replaceUser);
router.patch("/update", authenticate, updateUser);
router.get("/profile", authenticate, getUser);
router.get("/profile/:userId", authenticate, getUserById);
router.delete("/delete/:userId", authenticate, deleteUserById);

module.exports = router;
