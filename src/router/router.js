const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authRoute = require("./authRoute");
const apiRoute = require("./apiRoute");
const uploadController = require("../app/upload/uploadController");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/api/v1", apiRoute);

// upload route
router.post("/file/upload/:fileCategory?", uploadController.upload);
router.post("/file/load", uploadController.load);
router.delete("/file/delete", uploadController.delete);
router.get("/file/category", uploadController.category);
router.get("/file/mime-type", uploadController.mime);
router.get("/file/default", uploadController.default);

router.get("/", function (_, res) {
  res.send("Server OK");
});

module.exports = router;
