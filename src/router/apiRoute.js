const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const uploadController = require("../app/upload/uploadController");
const jabatanController = require("../app/api/jabatanController");
const divisiController = require("../app/api/divisiController");
const ptkpController = require("../app/api/ptkpController");
const roleController = require("../app/api/roleController");
const hakAksesController = require("../app/api/hakaksesController");
const kategoriCutiController = require("../app/api/kategoriCutiController");
const permissionController = require("../app/api/permissionController");
const dpaController = require("../app/api/dpaController");
const organisasiController = require("../app/api/organisasiController");
const fileCategoryController = require("../app/file/fileCategoryController");
const fileController = require("../app/file/fileController");
const unitKerjaController = require("../app/api/unitkerjaController");
const posisiController = require("../app/api/posisiController");
const pegawaiController = require("../app/api/pegawaiController");
const userController = require("../app/api/userController");
const absensiController = require("../app/api/absensiController");
const kalkulasiJarakController = require("../app/api/kalkulasiJarakController");
const historiPresensiController = require("../app/api/historiPresensiController");
const kontakListController = require("../app/api/kontaklistController");
const profileController = require("../app/api/profileController");
const asnController = require("../app/api/asnController");
const mobileController = require("../app/api/mobileController");
const divisiParentController = require("../app/api/divisiParentController");
const jamKerjaController = require("../app/api/jamkerjaController");
const jamKerjaDetailController = require("../app/api/jamkerjaDetailController");
const exportController = require("../app/api/exportController");
const actionController = require("../app/api/actionController");
const moduleController = require("../app/api/moduleController");
const userRoleController = require("../app/api/userRoleController");

//Lapbul
const kegiatanController = require("../app/api/kegiatanController");
const lapbulController = require("../app/lapbul/lapbulController");
const lampiranController = require("../app/lapbul/lampiranController");
const liburNasionalController = require("../app/api/liburNasionalController");

const timeController = require("../app/api/timeController");

//Event
const eventController = require("../app/event/eventController");

router.use(authMiddleware); // dont move it to another line
// upload route
router.post("/file/upload/:fileCategory?", uploadController.upload);
router.post("/file/load", uploadController.load);
router.delete("/file/delete", uploadController.delete);
router.get("/file/category", uploadController.category);
router.get("/file/mime-type", uploadController.mime);
router.get("/file/default", uploadController.default);

/* File Category Route */
const fileCategoryRoute = router.route("/file-category");
fileCategoryRoute.get(
  fileCategoryController.validate("get"),
  fileCategoryController.get
);
fileCategoryRoute.post(
  fileCategoryController.validate("create"),
  fileCategoryController.create
);
fileCategoryRoute.patch(
  fileCategoryController.validate("update"),
  fileCategoryController.update
);
fileCategoryRoute.delete(
  fileCategoryController.validate("delete"),
  fileCategoryController.delete
);
router.post("/file-category/data", fileCategoryController.data);
router.get("/file-category/list", fileCategoryController.list);

/* File Route */
const fileRoute = router.route("/file");
fileRoute.get(fileController.validate("get"), fileController.get);
router.post("/file/data", fileController.data);

/* Jabatan Route */
const jabatanRoute = router.route("/jabatan");
jabatanRoute.get(jabatanController.validate("get"), jabatanController.get);
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
divisiRoute.get(divisiController.validate("get"), divisiController.get);
divisiRoute.post(divisiController.validate("create"), divisiController.create);
divisiRoute.patch(divisiController.validate("update"), divisiController.update);
divisiRoute.delete(
  divisiController.validate("delete"),
  divisiController.delete
);
router.post("/divisi/data", divisiController.data);
router.get("/divisi/list", divisiController.list);
/* Divisi Route */

/* Ptkp Route */
const ptkpRoute = router.route("/ptkp");
ptkpRoute.get(ptkpController.validate("get"), ptkpController.get);
ptkpRoute.post(ptkpController.validate("create"), ptkpController.create);
ptkpRoute.patch(ptkpController.validate("update"), ptkpController.update);
ptkpRoute.delete(ptkpController.validate("delete"), ptkpController.delete);
router.post("/ptkp/data", ptkpController.data);
router.get("/ptkp/list", ptkpController.list);
/* Ptkp Route */

/* Role Route */
const roleRoute = router.route("/role");
roleRoute.get(roleController.validate("get"), roleController.get);
roleRoute.post(roleController.validate("create"), roleController.create);
roleRoute.patch(roleController.validate("update"), roleController.update);
roleRoute.delete(roleController.validate("delete"), roleController.delete);
router.post("/role/data", roleController.data);
router.get("/role/list", roleController.list);
/* Role Route */

/* Hak Akses Route */
const hakAksesRoute = router.route("/hak-akses");
hakAksesRoute.get(hakAksesController.validate("get"), hakAksesController.get);
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
dpaRoute.get(dpaController.validate("get"), dpaController.get);
dpaRoute.post(dpaController.validate("create"), dpaController.create);
dpaRoute.patch(dpaController.validate("update"), dpaController.update);
dpaRoute.delete(dpaController.validate("delete"), dpaController.delete);
router.post("/dpa/data", dpaController.data);
router.get("/dpa/list", dpaController.list);
/* DPA Route */

/* Organisasi Route */
const organisasiRoute = router.route("/organisasi");
organisasiRoute.get(
  organisasiController.validate("get"),
  organisasiController.get
);
organisasiRoute.post(
  organisasiController.validate("create"),
  organisasiController.create
);
organisasiRoute.patch(
  organisasiController.validate("update"),
  organisasiController.update
);
organisasiRoute.delete(
  organisasiController.validate("delete"),
  organisasiController.delete
);
router.post("/organisasi/data", organisasiController.data);
router.get("/organisasi/list", organisasiController.list);
/* Organisasi Route */

/* Unit Kerja Route */
const unitKerjaRoute = router.route("/unit-kerja");
unitKerjaRoute.get(
  unitKerjaController.validate("get"),
  unitKerjaController.get
);
unitKerjaRoute.post(
  unitKerjaController.validate("create"),
  unitKerjaController.create
);
unitKerjaRoute.patch(
  unitKerjaController.validate("update"),
  unitKerjaController.update
);
unitKerjaRoute.delete(
  unitKerjaController.validate("delete"),
  unitKerjaController.delete
);
router.post("/unit-kerja/data", unitKerjaController.data);
router.get("/unit-kerja/list", unitKerjaController.list);
/* Unit Kerja Route */

/* Posisi Route */
const posisiRoute = router.route("/posisi");
posisiRoute.get(posisiController.validate("get"), posisiController.get);
posisiRoute.post(posisiController.validate("create"), posisiController.create);
posisiRoute.patch(posisiController.validate("update"), posisiController.update);
posisiRoute.delete(
  posisiController.validate("delete"),
  posisiController.delete
);
router.post("/posisi/data", posisiController.data);
router.get("/posisi/list", posisiController.list);
/* Posisi Route */

/* Pegawai Route */
const pegawaiRoute = router.route("/pegawai");
pegawaiRoute.get(pegawaiController.validate("get"), pegawaiController.get);
pegawaiRoute.post(
  pegawaiController.validate("create"),
  pegawaiController.create
);
pegawaiRoute.patch(
  pegawaiController.validate("update"),
  pegawaiController.update
);
pegawaiRoute.delete(
  pegawaiController.validate("delete"),
  pegawaiController.delete
);
router.post("/pegawai/data", pegawaiController.data);
router.get("/pegawai/list", pegawaiController.list);
/* Pegawai Route */

/* User Route */
const userRoute = router.route("/user");
userRoute.get(userController.validate("get"), userController.get);
userRoute.post(userController.validate("create"), userController.create);
userRoute.patch(userController.validate("update"), userController.update);
userRoute.delete(userController.validate("delete"), userController.delete);
router.post("/user/data", userController.data);
router.get("/user/list", userController.list);
router.post(
  "/change-password",
  userController.validate("changePassword"),
  userController.changePassword
);
router.get("/user/permission", userController.permission);
router.post(
  "/user/send-credential",
  userController.validate("sendCredential"),
  userController.sendCredential
);
/* User Route */

/* Absensi Route */
const absensiRoute = router.route("/absensi");
absensiRoute.get(absensiController.validate("get"), absensiController.get);
absensiRoute.post(
  absensiController.validate("create"),
  absensiController.create
);
router.post("/absensi/data", absensiController.data);
router.get("/absensi/list", absensiController.list);
/* Absensi Route */

/* Kalkulasi Jarak Route */
const kalkulasiRoute = router.route("/kalkulasi-jarak");
kalkulasiRoute.post(
  kalkulasiJarakController.validate("create"),
  kalkulasiJarakController.create
);
/* Kalkulasi Jarak Route */

/* Histori Presensi Route */
const historiPresensiRoute = router.route("/histori-presensi");
historiPresensiRoute.get(
  historiPresensiController.validate("get"),
  historiPresensiController.get
);
/* Histori Presensi Route */

/* Histori Presensi Day Param Route */
const historiPresensiDayParamRoute = router.route("/histori-presensi-day");
historiPresensiDayParamRoute.get(
  historiPresensiController.getDateParam
);
/* Histori Presensi Day Param Route */

/* Histori Presensi Yesterday Route */
const historiPresensiYesterdayRoute = router.route("/histori-presensi-kemarin");
historiPresensiYesterdayRoute.get(
  historiPresensiController.getYesterday
);
/* Histori Presensi Yesterday Route */

/* Kontak List Route */
const kontakListRoute = router.route("/kontak-list");
kontakListRoute.get(
  kontakListController.validate("get"),
  kontakListController.get
);
const jumlahKontakRoute = router.route("/jumlah-kontak");
jumlahKontakRoute.get(
  kontakListController.validate("jumlahKontak"),
  kontakListController.jumlahKontak
);
/* Kontak List Route */

/* Profile Route */
const profileRoute = router.route("/profile");
profileRoute.get(profileController.validate("get"), profileController.get);
/* Profile Route */

/* ASN Route */
const asnRoute = router.route("/asn");
asnRoute.get(asnController.validate("get"), asnController.get);
asnRoute.post(asnController.validate("create"), asnController.create);
asnRoute.patch(asnController.validate("update"), asnController.update);
asnRoute.delete(asnController.validate("delete"), asnController.delete);
router.get("/asn/list", asnController.list);
router.post("/asn/data", asnController.data);
/* ASN Route */

/* Mobile Route */
router.post("/mobile/update-user", mobileController.updateUser);
router.post(
  "/mobile/firstlogin-password",
  mobileController.validate("firstLoginPassword"),
  mobileController.firstLoginPassword
);
router.delete("/mobile/delete-account", mobileController.deleteAccount);
/* Mobile Route */

/* Divisi Parent Route */
const divisiParentRoute = router.route("/divisi-parent");
divisiParentRoute.get(
  divisiParentController.validate("get"),
  divisiParentController.get
);
divisiParentRoute.post(
  divisiParentController.validate("create"),
  divisiParentController.create
);
divisiParentRoute.patch(
  divisiParentController.validate("update"),
  divisiParentController.update
);
divisiParentRoute.delete(
  divisiParentController.validate("delete"),
  divisiParentController.delete
);
router.post("/divisi-parent/data", divisiParentController.data);
router.get("/divisi-parent/list", divisiParentController.list);
/* Divisi Parent Route */

/* Jam Kerja Route */
const jamKerjaRoute = router.route("/jam-kerja");
jamKerjaRoute.get(jamKerjaController.validate("get"), jamKerjaController.get);
jamKerjaRoute.post(
  jamKerjaController.validate("create"),
  jamKerjaController.create
);
jamKerjaRoute.patch(
  jamKerjaController.validate("update"),
  jamKerjaController.update
);
jamKerjaRoute.delete(
  jamKerjaController.validate("delete"),
  jamKerjaController.delete
);
router.post("/jam-kerja/data", jamKerjaController.data);
router.get("/jam-kerja/list", jamKerjaController.list);
/* Jam Kerja Route */

/* Jam Kerja Detail Route */
const jamKerjaDetailRoute = router.route("/jam-kerja-detail");
jamKerjaDetailRoute.get(
  jamKerjaDetailController.validate("get"),
  jamKerjaDetailController.get
);
jamKerjaDetailRoute.post(
  jamKerjaDetailController.validate("create"),
  jamKerjaDetailController.create
);
jamKerjaDetailRoute.patch(
  jamKerjaDetailController.validate("update"),
  jamKerjaDetailController.update
);
jamKerjaDetailRoute.delete(
  jamKerjaDetailController.validate("delete"),
  jamKerjaDetailController.delete
);
router.post("/jam-kerja-detail/data", jamKerjaDetailController.data);
router.get("/jam-kerja-detail/list", jamKerjaDetailController.list);
/* Jam Kerja Detail Route */

/* Kegiatan Route */
const kegiatanRoute = router.route("/kegiatan");
kegiatanRoute.get(kegiatanController.get);
kegiatanRoute.post(kegiatanController.create);
kegiatanRoute.patch(kegiatanController.update);
kegiatanRoute.delete(kegiatanController.delete);
router.get("/kegiatan/list", kegiatanController.list);
router.post("/kegiatan/data", kegiatanController.data);
router.get("/kegiatan/detail", kegiatanController.detail);
/* Kegiatan Route */

/* Export Route */
router.post("/export-absensi", exportController.exportAbsensi);
/* Export Route */

/* Lapbul Route */
const lapulRoute = router.route("/lapbul");
lapulRoute.get(lapbulController.list);
lapulRoute.post(lapbulController.create);
lapulRoute.patch(lapbulController.update);
lapulRoute.delete(lapbulController.delete);
router.post("/lapbul/generate", lapbulController.generate);
router.post("/lapbul/poc", lapbulController.poc);
router.get("/lapbul/:id_lapbul", lapbulController.get_by_id);
router.post("/lapbul/data", lapbulController.data);
/* Lapbul Route */

/* Libur Nasional Route */
const liburNasionalRoute = router.route("/liburnasional");
liburNasionalRoute.get(liburNasionalController.get);
liburNasionalRoute.post(liburNasionalController.create);
liburNasionalRoute.patch(liburNasionalController.update);
liburNasionalRoute.delete(liburNasionalController.delete);
router.get("/liburnasional/list", liburNasionalController.list);
router.post("/liburnasional/data", liburNasionalController.data);
/* Libur Nasional Route */

/* Lampiran Route */
const lampiranRoute = router.route("/lampiran");
lampiranRoute.get(lampiranController.list);
router.get("/lampiran/generate", lampiranController.generate);
router.get("/lampiran/generate/:id_lapbul", lampiranController.generateByLapbulId);
/* Lampiran Route */

/* Time Route */
const timeRoute = router.route("/time");
timeRoute.get(timeController.get);

/* Action Route */
const actionRoute = router.route("/action");
actionRoute.get(actionController.validate("get"), actionController.get);
actionRoute.post(actionController.validate("create"), actionController.create);
actionRoute.patch(actionController.validate("update"), actionController.update);
actionRoute.delete(
  actionController.validate("delete"),
  actionController.delete
);
router.post("/action/data", actionController.data);
router.get("/action/list", actionController.list);
/* Action Route */

/* Module Route */
const moduleRoute = router.route("/module");
moduleRoute.get(moduleController.validate("get"), moduleController.get);
moduleRoute.post(moduleController.validate("create"), moduleController.create);
moduleRoute.patch(moduleController.validate("update"), moduleController.update);
moduleRoute.delete(
  moduleController.validate("delete"),
  moduleController.delete
);
router.post("/module/data", moduleController.data);
router.get("/module/list", moduleController.list);
/* Module Route */

/* User Role */
const userRoleRoute = router.route("/user-role");
userRoleRoute.get(userRoleController.validate("get"), userRoleController.get);
userRoleRoute.post(
  userRoleController.validate("create"),
  userRoleController.create
);
userRoleRoute.patch(
  userRoleController.validate("update"),
  userRoleController.update
);
userRoleRoute.delete(
  userRoleController.validate("delete"),
  userRoleController.delete
);
router.post("/user-role/data", userRoleController.data);
router.get("/user-role/permission", userRoleController.permission);
router.get("/user-role/list", userRoleController.list);
/* User Role */


/* Event Route */
const eventRoute = router.route("/event");
eventRoute.get(eventController.validate("get"), eventController.get);
eventRoute.post(eventController.validate("create"), eventController.create);
eventRoute.patch(eventController.validate("update"), eventController.update);
eventRoute.delete(eventController.validate("delete"), eventController.delete);

router.get("/event/list", eventController.list);
/* Event Route */

module.exports = router;
