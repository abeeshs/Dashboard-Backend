const express = require("express");
const authController = require("../controllers/authController");
const { userProtect } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/signup", authController.userRegister);
router.get("/signup", authController.userRegister);
router.post("/login", authController.userLogin);
router.get("/", userProtect, authController.getDashboard);

module.exports = router;
