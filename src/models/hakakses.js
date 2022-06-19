"use strict";

module.exports = (sequelize, DataTypes) => {
  const hakakses = sequelize.define(
    "tbl_hakakses",
    {
      id_hakakses: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kode_hakakses: DataTypes.STRING,
      keterangan_hakakses: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return hakakses;
};
