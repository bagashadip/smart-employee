"use strict";

module.exports = (sequelize, DataTypes) => {
  const jamkerja = sequelize.define(
    "tbl_jamkerja",
    {
      id_jamkerja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_jamkerja: DataTypes.STRING,
      tampil_jamkerja: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
    }
  );
  return jamkerja;
};
