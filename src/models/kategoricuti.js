"use strict";

module.exports = (sequelize, DataTypes) => {
  const kategoricuti = sequelize.define(
    "tbl_kategoricuti",
    {
      id_kategoricuti: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kode_kategoricuti: DataTypes.STRING,
      keterangan_kategoricuti: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return kategoricuti;
};
