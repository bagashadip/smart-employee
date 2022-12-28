const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authRoute = require("./authRoute");
const apiRoute = require("./apiRoute");
const mailerController = require("../app/api/mailerController");
const webCorpController = require("../app/webcorp/webCorpController");

const router = express.Router();

router.use("/api/v2/auth", authRoute);
router.use("/api/v2", apiRoute);

// const mailerRoute = router.route("/mailer");
// mailerRoute.get(mailerController.send);

router.post("/mailer", mailerController.send);

// web corp
router.get(
  "/api/webcorp/pegawai",
  webCorpController.validate("get"),
  webCorpController.get
);

router.get("/", function (_, res) {
  res.send("Server OK");
});

module.exports = router;
