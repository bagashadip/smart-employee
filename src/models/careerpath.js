"use strict";

module.exports = (sequelize, DataTypes) => {
  const careerpath = sequelize.define(
    "tbl_careerpath",
    {
        id_careerpath: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      kode_careerpath: DataTypes.STRING,
      nama_careerpath: DataTypes.STRING,
      kode_divisi: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return careerpath;
};
