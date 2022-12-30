"use strict";

module.exports = (sequelize, DataTypes) => {
  const absensi = sequelize.define(
    "tbl_absensi",
    {
      id_absensi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      foto_absensi: DataTypes.UUID,
      longitude_absensi: DataTypes.DOUBLE,
      latitude_absensi: DataTypes.DOUBLE,
      label_absensi: DataTypes.STRING,
      catatan_absensi: DataTypes.TEXT,
      tipe_absensi: DataTypes.STRING,
      timestamp_absensi: DataTypes.DATE,
      kode_pegawai: DataTypes.STRING,
      time_limit_datang: DataTypes.TIME,
      time_limit_pulang: DataTypes.TIME,
    },
    {
      freezeTableName: true,
    }
  );
  return absensi;
};
