"use strict";

module.exports = (sequelize, DataTypes) => {
  const jamkerjadetail = sequelize.define(
    "tbl_jamkerjadetail",
    {
      id_jamkerjadetail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_jamkerjadetail: DataTypes.STRING,
      jam_datang: DataTypes.TIME,
      jam_pulang: DataTypes.TIME,
      kode_jamkerja: DataTypes.STRING,
      durasi_kerja: DataTypes.TIME,
      jam_pulang_max: DataTypes.TIME,
    },
    {
      freezeTableName: true,
    }
  );
  return jamkerjadetail;
};
