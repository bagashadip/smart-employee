"use strict";

module.exports = (sequelize, DataTypes) => {
  const divisiParent = sequelize.define(
    "tbl_divisi_parent",
    {
      id_divisi_parent: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_divisi_parent: DataTypes.STRING,
      nama_divisi_parent: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  return divisiParent;
};
