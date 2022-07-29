"use strict";

module.exports = (sequelize, DataTypes) => {
  const jabatan = sequelize.define(
    "tbl_jabatan",
    {
      id_jabatan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_jabatan: DataTypes.STRING,
      nama_jabatan: DataTypes.STRING,
      urutan_jabatan: DataTypes.INTEGER,
    },
    {
      freezeTableName: true,
    }
  );
  return jabatan;
};
