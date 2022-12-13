"use strict";

module.exports = (sequelize, DataTypes) => {
  const posisi = sequelize.define(
    "tbl_posisi",
    {
      id_posisi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_posisi: DataTypes.STRING,
      nama_posisi: DataTypes.STRING,
      kak: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
    }
  );
  return posisi;
};
