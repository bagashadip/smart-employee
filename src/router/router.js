const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authRoute = require("./authRoute");
const apiRoute = require("./apiRoute");
const mailerController = require("../app/api/mailerController");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/api/v1", apiRoute);

// const mailerRoute = router.route("/mailer");
// mailerRoute.get(mailerController.send);

router.post("/mailer", mailerController.send);

router.get("/", function (_, res) {
  res.send("Server OK");
});

module.exports = router;
