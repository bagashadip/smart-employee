const Sequelize = require("sequelize");
const sequelize = require("../util/database");


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

Divisi.belongsTo(UnitKerja, {
  as: "unitkerja",
  foreignKey: "kode_unitkerja",
  targetKey: "kode_unitkerja",
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
    User,
    Jabatan,
    Log,
    Pegawai,
    Divisi,
    UnitKerja,
    Role,
    Ptkp,
    HakAkses,
    KategoriCuti
  };