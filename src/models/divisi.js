"use strict";

module.exports = (sequelize, DataTypes) => {
  const divisi = sequelize.define(
    "tbl_divisi",
    {
      id_divisi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_divisi: DataTypes.STRING,
      nama_divisi: DataTypes.STRING,
      kode_unitkerja: DataTypes.STRING,
      kode_divisi_parent: DataTypes.STRING,
      kode_pegawai_manajer: DataTypes.INTEGER,
      nip_asn: DataTypes.INTEGER,
    },
    {
      freezeTableName: true,
    }
  );
  return divisi;
};
