const express = require("express");
const authController = require("../app/auth/authController");

const router = express.Router();

router.post(
  "/register",
  authController.validate("register"),
  authController.register
);

router.post(
  "/login-with-password",
  authController.validate("loginWithPassword"),
  authController.loginWithPassword
);

router.post("/verify", authController.refreshToken);

module.exports = router;
