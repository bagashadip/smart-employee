const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authRoute = require("./authRoute");
const apiRoute = require("./apiRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/api/v1", apiRoute);

router.get("/", function (_, res) {
  res.send("Server OK");
});

module.exports = router;
