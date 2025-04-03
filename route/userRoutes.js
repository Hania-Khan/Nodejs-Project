const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
  createUser,
  loginUser,
  replaceUser,
  updateUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.put("/replace", authenticate, replaceUser);
router.patch("/update", authenticate, updateUser);

module.exports = router;
