"use strict";

module.exports = (sequelize, DataTypes) => {
  const organisasi = sequelize.define(
    "tbl_organisasi",
    {
      id_organisasi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_organisasi: DataTypes.STRING,
      nama_organisasi: DataTypes.STRING,
      logo_organisasi: DataTypes.UUID,
      longitude_organisasi: DataTypes.DOUBLE,
      latitude_organisasi: DataTypes.DOUBLE,
      radiuslokasi_organisasi: DataTypes.INTEGER,
      alamat_organisasi: DataTypes.TEXT,
      notelp_organisasi: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  return organisasi;
};
