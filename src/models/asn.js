"use strict";

module.exports = (sequelize, DataTypes) => {
  const asn = sequelize.define(
    "tbl_asn",
    {
      id_asn: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nip_asn: {
        type: DataTypes.STRING,
        unique: true,
      },
      nama_asn: DataTypes.STRING,
      tanggallahir_asn: DataTypes.DATEONLY,
      jabatan_asn: DataTypes.STRING,
      notelp_asn: DataTypes.STRING,
      email_asn: DataTypes.STRING,
      foto_asn: DataTypes.UUID,
      statusaktif_asn: DataTypes.STRING,
      status_asn: DataTypes.STRING,
      alamat_asn: DataTypes.TEXT,
      kode_divisi: DataTypes.STRING,
      kode_jabatan: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  return asn;
};
