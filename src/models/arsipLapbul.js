"use strict";

module.exports = (sequelize, DataTypes) => {
  const arsipLapbul = sequelize.define(
    "tbl_arsip_lapbul",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      kode_pegawai: DataTypes.UUID,
      name: DataTypes.STRING,
      period: DataTypes.DATEONLY,
      file: DataTypes.UUID,
      status: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  return arsipLapbul;
};
