const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const mFileCategory = require("./fileCategory");
const mFile = require("./file");
const mUser = require("./user");
const mRole = require("./role");
const mUserRole = require("./userRole");
const mModule = require("./module");
const mAction = require("./action");
const mStatus = require("./status");
const mJabatan = require("./jabatan");
const mLog = require("./log");
const mPegawai = require("./pegawai");
const mDivisi = require("./divisi");
const mUnitKerja = require("./unitkerja");
const mPtkp = require("./ptkp");
const mHakAkses = require("./hakakses");
const mKategoriCuti = require("./kategoricuti");
const mPermission = require("./permission");
const mDpa = require("./dpa");
const mOrganisasi = require("./organisasi");
const mPosisi = require("./posisi");
const mAbsensi = require("./absensi");
const mAsn = require("./asn");
const mDivisiParent = require("./divisiParent");
const mJamKerja = require("./jamkerja");
const mJamKerjaDetail = require("./jamkerjaDetail");
const mKegiatan = require("./kegiatan");
const mLapbul = require("./lapbul");
const mLiburNasional = require("./liburnasional");
const mArsipLapbul = require("./arsipLapbul");
const mArsipLapbulLog = require("./arsipLapbulLog");
const mEvent = require("./event");
const mNotifikasi = require("./notifikasi");

const FileCategory = mFileCategory(sequelize, Sequelize);
const File = mFile(sequelize, Sequelize);
const User = mUser(sequelize, Sequelize);
const Role = mRole(sequelize, Sequelize);
const UserRole = mUserRole(sequelize, Sequelize);
const Module = mModule(sequelize, Sequelize);
const Action = mAction(sequelize, Sequelize);
const Status = mStatus(sequelize, Sequelize);
const Jabatan = mJabatan(sequelize, Sequelize);
const Log = mLog(sequelize, Sequelize);
const Pegawai = mPegawai(sequelize, Sequelize);
const Divisi = mDivisi(sequelize, Sequelize);
const UnitKerja = mUnitKerja(sequelize, Sequelize);
const Ptkp = mPtkp(sequelize, Sequelize);
const HakAkses = mHakAkses(sequelize, Sequelize);
const KategoriCuti = mKategoriCuti(sequelize, Sequelize);
const Permission = mPermission(sequelize, Sequelize);
const Dpa = mDpa(sequelize, Sequelize);
const Organisasi = mOrganisasi(sequelize, Sequelize);
const Posisi = mPosisi(sequelize, Sequelize);
const Absensi = mAbsensi(sequelize, Sequelize);
const Asn = mAsn(sequelize, Sequelize);
const DivisiParent = mDivisiParent(sequelize, Sequelize);
const JamKerja = mJamKerja(sequelize, Sequelize);
const JamKerjaDetail = mJamKerjaDetail(sequelize, Sequelize);
const Kegiatan = mKegiatan(sequelize, Sequelize);
const Lapbul = mLapbul(sequelize, Sequelize);
const LiburNasional = mLiburNasional(sequelize, Sequelize);
const ArsipLapbul = mArsipLapbul(sequelize, Sequelize);
const ArsipLapbulLog = mArsipLapbulLog(sequelize, Sequelize);
const Event = mEvent(sequelize, Sequelize);
const Notifikasi = mNotifikasi(sequelize, Sequelize);

FileCategory.hasMany(File);
File.belongsTo(FileCategory, { foreignKey: "fileCategoryId" });

User.hasMany(UserRole, {
  sourceKey: "id_user",
  foreignKey: "userId",
});
UserRole.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id_user",
});

User.belongsTo(Pegawai, {
  as: "pegawai",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

User.belongsTo(Asn, {
  as: "asn",
  foreignKey: "nip_asn",
  targetKey: "nip_asn",
});

Pegawai.belongsTo(File, {
  as: "foto",
  foreignKey: "foto_pegawai",
  targetKey: "id",
});

Pegawai.belongsTo(Ptkp, {
  as: "ptkp",
  foreignKey: "ptkp_pegawai",
  targetKey: "kode_ptkp",
});

Pegawai.belongsTo(Posisi, {
  as: "posisi",
  foreignKey: "kode_posisi",
  targetKey: "kode_posisi",
});

Pegawai.belongsTo(Divisi, {
  as: "divisi",
  foreignKey: "kode_divisi",
  targetKey: "kode_divisi",
});

Pegawai.belongsTo(Dpa, {
  as: "dpa",
  foreignKey: "kode_dpa",
  targetKey: "kode_dpa",
});

Pegawai.belongsTo(User, {
  as: "user",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

Pegawai.belongsTo(JamKerja, {
  as: "jamkerja",
  foreignKey: "kode_jamkerja",
  targetKey: "kode_jamkerja",
});

Asn.belongsTo(Jabatan, {
  as: "jabatan",
  foreignKey: "kode_jabatan",
  targetKey: "kode_jabatan",
});

Asn.belongsTo(File, {
  as: "foto",
  foreignKey: "foto_asn",
  targetKey: "id",
});

Asn.belongsTo(DivisiParent, {
  as: "divisi_parent",
  foreignKey: "kode_divisi_parent",
  targetKey: "kode_divisi_parent",
});

Asn.belongsTo(User, {
  as: "user",
  foreignKey: "nip_asn",
  targetKey: "nip_asn",
});

Divisi.belongsTo(UnitKerja, {
  as: "unitkerja",
  foreignKey: "kode_unitkerja",
  targetKey: "kode_unitkerja",
});

Divisi.belongsTo(DivisiParent, {
  as: "divisi_parent",
  foreignKey: "kode_divisi_parent",
  targetKey: "kode_divisi_parent",
});

Divisi.belongsTo(Pegawai, {
  as: "manajer",
  foreignKey: "kode_pegawai_manajer",
  targetKey: "kode_pegawai",
});

Divisi.belongsTo(Asn, {
  as: "asn",
  foreignKey: "nip_asn",
  targetKey: "nip_asn",
});

Divisi.belongsTo(File, {
  as: "template_lapbul_file",
  foreignKey: "template_lapbul",
  targetKey: "id",
});

DivisiParent.hasMany(Divisi, {
  as: "divisi",
  foreignKey: "kode_divisi_parent",
  sourceKey: "kode_divisi_parent",
});

Permission.belongsTo(HakAkses, {
  as: "hakakses",
  foreignKey: "kode_hakakses",
  targetKey: "kode_hakakses",
});

HakAkses.belongsTo(Permission, {
  as: "permission",
  foreignKey: "kode_hakakses",
  targetKey: "kode_hakakses",
});

Organisasi.belongsTo(File, {
  as: "logo",
  foreignKey: "logo_organisasi",
  targetKey: "id",
});

UnitKerja.belongsTo(Organisasi, {
  as: "organisasi",
  foreignKey: "kode_organisasi",
  targetKey: "kode_organisasi",
});

UnitKerja.belongsTo(File, {
  as: "logo",
  foreignKey: "logo_unitkerja",
  targetKey: "id",
});

Absensi.belongsTo(File, {
  as: "foto",
  foreignKey: "foto_absensi",
  targetKey: "id",
});

Absensi.belongsTo(Pegawai, {
  as: "pegawai",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

JamKerja.hasMany(JamKerjaDetail, {
  as: "jamkerjaDetail",
  foreignKey: "kode_jamkerja",
  sourceKey: "kode_jamkerja",
});

JamKerjaDetail.belongsTo(JamKerja, {
  as: "jamkerja",
  foreignKey: "kode_jamkerja",
  targetKey: "kode_jamkerja",
});

Kegiatan.belongsTo(File, {
  as: "foto",
  foreignKey: "foto_kegiatan",
  targetKey: "id",
});

Kegiatan.belongsTo(Pegawai, {
  as: "pegawai",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

Lapbul.belongsTo(Pegawai, {
  as: "pegawai",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

Lapbul.belongsTo(Divisi, {
  as: "divisi",
  foreignKey: "kode_divisi",
  targetKey: "kode_divisi",
});

ArsipLapbul.belongsTo(File, {
  as: "lapbul_file",
  foreignKey: "file",
  targetKey: "id",
});

ArsipLapbul.belongsTo(Pegawai, {
  as: "pegawai",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
authenticate();

module.exports = {
  FileCategory,
  File,
  User,
  Role,
  Jabatan,
  Log,
  Pegawai,
  Divisi,
  UnitKerja,
  Ptkp,
  HakAkses,
  KategoriCuti,
  Permission,
  Dpa,
  Organisasi,
  Posisi,
  Absensi,
  Asn,
  DivisiParent,
  JamKerja,
  JamKerjaDetail,
  Kegiatan,
  Lapbul,
  Module,
  Action,
  Status,
  UserRole,
  LiburNasional,
  ArsipLapbul,
  ArsipLapbulLog,
  Event,
  Notifikasi
};
