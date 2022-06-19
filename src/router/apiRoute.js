const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const jabatanController = require("../app/api/jabatanController");
const divisiController = require("../app/api/divisiController");

router.use(authMiddleware);

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

/* Divisi Route */
const divisiRoute = router.route("/divisi");
divisiRoute.get(
  divisiController.validate("get"),
  divisiController.get
);
divisiRoute.post(
  divisiController.validate("create"),
  divisiController.create
);
divisiRoute.patch(
  divisiController.validate("update"),
  divisiController.update
);
divisiRoute.delete(
  divisiController.validate("delete"),
  divisiController.delete
);
router.post("/divisi/data", divisiController.data);
router.get("/divisi/list", divisiController.list);
/* Divisi Route */


module.exports = router;