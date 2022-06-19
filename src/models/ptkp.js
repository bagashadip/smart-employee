"use strict";

module.exports = (sequelize, DataTypes) => {
  const ptkp = sequelize.define(
    "tbl_ptkp",
    {
        id_ptkp: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      kode_ptkp: DataTypes.STRING,
      keterangan_ptkp: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return ptkp;
};
