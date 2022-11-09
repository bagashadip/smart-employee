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

router.post(
  "/check-user-email",
  authController.validate("checkUserEmail"),
  authController.checkUserEmail
);

router.post("/login", authController.validate("login"), authController.login);
router.post("/login-email", authController.validate("loginByEmail"), authController.loginByEmail);

router.post(
  "/forgot-username",
  authController.validate("forgotUsername"),
  authController.forgotUsername
);

router.get("/reset-attempt", authController.resetAttempt);

router.post("/verify", authController.refreshToken);

router.post(
  "/forgot-password",
  authController.validate("forgotPassword"),
  authController.forgotPassword
);

router.post(
  "/verify-otp",
  authController.validate("verifyOtp"),
  authController.verifyOtp
);

router.post(
  "/reset-password",
  authController.validate("resetPassword"),
  authController.resetPassword
);

module.exports = router;
