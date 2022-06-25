const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const jabatanController = require("../app/api/jabatanController");
const divisiController = require("../app/api/divisiController");
const ptkpController = require("../app/api/ptkpController");
const roleController = require("../app/api/roleController");
const hakAksesController = require("../app/api/hakaksesController");
const kategoriCutiController = require("../app/api/kategoriCutiController");
const permissionController = require("../app/api/permissionController");
const dpaController = require("../app/api/dpaController");
const careerPathController = require("../app/api/careerpathController");

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

/* Hak Akses Route */
const hakAksesRoute = router.route("/hak-akses");
hakAksesRoute.get(
  hakAksesController.validate("get"),
  hakAksesController.get
);
hakAksesRoute.post(
  hakAksesController.validate("create"),
  hakAksesController.create
);
hakAksesRoute.patch(
  hakAksesController.validate("update"),
  hakAksesController.update
);
hakAksesRoute.delete(
  hakAksesController.validate("delete"),
  hakAksesController.delete
);
router.post("/hak-akses/data", hakAksesController.data);
router.get("/hak-akses/list", hakAksesController.list);
/* Hak Akses Route */

/* Kategori Cuti Route */
const kategoriCutiRoute = router.route("/kategori-cuti");
kategoriCutiRoute.get(
  kategoriCutiController.validate("get"),
  kategoriCutiController.get
);
kategoriCutiRoute.post(
  kategoriCutiController.validate("create"),
  kategoriCutiController.create
);
kategoriCutiRoute.patch(
  kategoriCutiController.validate("update"),
  kategoriCutiController.update
);
kategoriCutiRoute.delete(
  kategoriCutiController.validate("delete"),
  kategoriCutiController.delete
);
router.post("/kategori-cuti/data", kategoriCutiController.data);
router.get("/kategori-cuti/list", kategoriCutiController.list);
/* Kategori Cuti Route */

/* Permission Route */
const permissionRoute = router.route("/permission");
permissionRoute.get(
  permissionController.validate("get"),
  permissionController.get
);
permissionRoute.post(
  permissionController.validate("create"),
  permissionController.create
);
permissionRoute.patch(
  permissionController.validate("update"),
  permissionController.update
);
permissionRoute.delete(
  permissionController.validate("delete"),
  permissionController.delete
);
router.post("/permission/data", permissionController.data);
router.get("/permission/list", permissionController.list);
/* Permission Route */

/* DPA Route */
const dpaRoute = router.route("/dpa");
dpaRoute.get(
  dpaController.validate("get"),
  dpaController.get
);
dpaRoute.post(
  dpaController.validate("create"),
  dpaController.create
);
dpaRoute.patch(
  dpaController.validate("update"),
  dpaController.update
);
dpaRoute.delete(
  dpaController.validate("delete"),
  dpaController.delete
);
router.post("/dpa/data", dpaController.data);
router.get("/dpa/list", dpaController.list);
/* DPA Route */

/* Career Path Route */
const careerPathRoute = router.route("/career-path");
careerPathRoute.get(
  careerPathController.validate("get"),
  careerPathController.get
);
careerPathRoute.post(
  careerPathController.validate("create"),
  careerPathController.create
);
careerPathRoute.patch(
  careerPathController.validate("update"),
  careerPathController.update
);
careerPathRoute.delete(
  careerPathController.validate("delete"),
  careerPathController.delete
);
router.post("/career-path/data", careerPathController.data);
router.get("/career-path/list", careerPathController.list);
/* Career Path Route */


module.exports = router;