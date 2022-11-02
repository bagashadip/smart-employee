"use strict";

module.exports = (sequelize, DataTypes) => {
  const dpa = sequelize.define(
    "tbl_dpa",
    {
        id_dpa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      kode_dpa: DataTypes.STRING,
      nama_dpa: DataTypes.STRING,
      grade_dpa: DataTypes.INTEGER,
      jenis_kontrak: DataTypes.INTEGER
    },
    {
      freezeTableName: true
    }
  );
  return dpa;
};
