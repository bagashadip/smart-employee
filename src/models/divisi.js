"use strict";

module.exports = (sequelize, DataTypes) => {
  const divisi = sequelize.define(
    "tbl_divisi",
    {
        id_divisi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      kode_divisi: DataTypes.STRING,
      nama_divisi: DataTypes.STRING,
      kode_unitkerja: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return divisi;
};
