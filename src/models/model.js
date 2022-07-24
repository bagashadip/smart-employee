const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const mFileCategory = require("./fileCategory");
const mFile = require("./file");
const mUser = require("./user");
const mJabatan = require("./jabatan");
const mLog = require("./log");
const mPegawai = require("./pegawai");
const mRole = require("./role");
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

const FileCategory = mFileCategory(sequelize, Sequelize);
const File = mFile(sequelize, Sequelize);
const User = mUser(sequelize, Sequelize);
const Jabatan = mJabatan(sequelize, Sequelize);
const Log = mLog(sequelize, Sequelize);
const Pegawai = mPegawai(sequelize, Sequelize);
const Role = mRole(sequelize, Sequelize);
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

FileCategory.hasMany(File);
File.belongsTo(FileCategory, { foreignKey: "fileCategoryId" });

User.belongsTo(Pegawai, {
  as: "pegawai",
  foreignKey: "kode_pegawai",
  targetKey: "kode_pegawai",
});

User.belongsTo(Role, {
  as: "role",
  foreignKey: "kode_role",
  targetKey: "kode_role",
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

Asn.belongsTo(Divisi, {
  as: "divisi",
  foreignKey: "kode_divisi",
  targetKey: "kode_divisi",
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

Role.belongsTo(Permission, {
  as: "permission",
  foreignKey: "kode_role",
  targetKey: "kode_role",
});

Permission.belongsTo(HakAkses, {
  as: "hakakses",
  foreignKey: "kode_hakakses",
  targetKey: "kode_hakakses",
});

Permission.belongsTo(Role, {
  as: "role",
  foreignKey: "kode_role",
  targetKey: "kode_role",
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
  Jabatan,
  Log,
  Pegawai,
  Divisi,
  UnitKerja,
  Role,
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
};
