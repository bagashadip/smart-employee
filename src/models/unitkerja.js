"use strict";

module.exports = (sequelize, DataTypes) => {
  const unitkerja = sequelize.define(
    "tbl_unitkerja",
    {
        id_unitkerja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      kode_unitkerja: DataTypes.STRING,
      nama_unitkerja: DataTypes.STRING,
      logo_unitkerja: DataTypes.TEXT,
      longitude_unitkerja: DataTypes.DOUBLE,
      latitude_unitkerja: DataTypes.DOUBLE,
      radiuslokasi_unitkerja: DataTypes.INTEGER,
      alamat_unitkerja: DataTypes.TEXT,
      notelp_unitkerja: DataTypes.STRING,
      kode_organisasi: DataTypes.STRING,
    },
    {
      freezeTableName: true
    }
  );
  return unitkerja;
};
