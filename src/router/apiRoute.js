const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const jabatanController = require("../app/api/jabatanController");

/* Jabatan Route */
const jabatanRoute = router.route("/jabatan");
jabatanRoute.get(
  jabatanController.validate("get"),
  jabatanController.get
);
jabatanRoute.post(
  jabatanController.validate("create"),
  jabatanController.create
);
jabatanRoute.patch(
  jabatanController.validate("update"),
  jabatanController.update
);
jabatanRoute.delete(
  jabatanController.validate("delete"),
  jabatanController.delete
);
router.post("/jabatan/data", jabatanController.data);
router.get("/jabatan/list", jabatanController.list);
/* Jabatan Route */

router.use(authMiddleware);

module.exports = router;