const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const jabatanController = require("../app/api/jabatanController");
const divisiController = require("../app/api/divisiController");
const ptkpController = require("../app/api/ptkpController");
const roleController = require("../app/api/roleController");

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

/* Ptkp Route */
const ptkpRoute = router.route("/ptkp");
ptkpRoute.get(
  ptkpController.validate("get"),
  ptkpController.get
);
ptkpRoute.post(
  ptkpController.validate("create"),
  ptkpController.create
);
ptkpRoute.patch(
  ptkpController.validate("update"),
  ptkpController.update
);
ptkpRoute.delete(
  ptkpController.validate("delete"),
  ptkpController.delete
);
router.post("/ptkp/data", ptkpController.data);
router.get("/ptkp/list", ptkpController.list);
/* Ptkp Route */

/* Role Route */
const roleRoute = router.route("/role");
roleRoute.get(
  roleController.validate("get"),
  roleController.get
);
roleRoute.post(
  roleController.validate("create"),
  roleController.create
);
roleRoute.patch(
  roleController.validate("update"),
  roleController.update
);
roleRoute.delete(
  roleController.validate("delete"),
  roleController.delete
);
router.post("/role/data", roleController.data);
router.get("/role/list", roleController.list);
/* Role Route */


module.exports = router;