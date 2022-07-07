const express = require("express");
const authController = require("../app/auth/authController");

const router = express.Router();

router.post(
  "/register",
  authController.validate("register"),
  authController.register
);

router.post(
  "/check-user",
  authController.validate("checkUser"),
  authController.checkUser
);

router.post("/login", authController.validate("login"), authController.login);

router.post(
  "/change-password",
  authController.validate("changePassword"),
  authController.changePassword
);

router.post(
  "/forgot-username",
  authController.validate("forgotUsername"),
  authController.forgotUsername
);

router.post("/verify", authController.refreshToken);

module.exports = router;
