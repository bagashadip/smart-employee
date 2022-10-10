"use strict";

module.exports = (sequelize, DataTypes) => {
  const pegawai = sequelize.define(
    "tbl_pegawai",
    {
      id_pegawai: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kode_pegawai: DataTypes.STRING,
      namalengkap_pegawai: DataTypes.STRING,
      noktp_pegawai: DataTypes.STRING,
      jeniskelamin_pegawai: DataTypes.STRING,
      tanggallahir_pegawai: DataTypes.DATEONLY,
      goldarah_pegawai: DataTypes.STRING,
      statuspernikahan_pegawai: DataTypes.STRING,
      agama_pegawai: DataTypes.STRING,
      notelp_pegawai: DataTypes.STRING,
      emailpribadi_pegawai: DataTypes.STRING,
      emailjsc_pegawai: DataTypes.STRING,
      foto_pegawai: DataTypes.UUID,
      alamatktp_pegawai: DataTypes.TEXT,
      alamatdomisili_pegawai: DataTypes.TEXT,
      namakontakdarurat_pegawai: DataTypes.STRING,
      notelpdarurat_pegawai: DataTypes.STRING,
      norekening_pegawai: DataTypes.STRING,
      bankrekening_pegawai: DataTypes.STRING,
      npwp_pegawai: DataTypes.STRING,
      nobpjskesehatan_pegawai: DataTypes.STRING,
      nobpjsketenagakerjaan_pegawai: DataTypes.STRING,
      tanggalbergabung_pegawai: DataTypes.DATEONLY,
      tanggallulus_pegawai: DataTypes.DATEONLY,
      status_pegawai: DataTypes.STRING,
      ptkp_pegawai: DataTypes.STRING,
      kode_posisi: DataTypes.STRING,
      kode_divisi: DataTypes.STRING,
      kode_dpa: DataTypes.STRING,
      statusaktif_pegawai: DataTypes.STRING,
      persetujuan_kontak: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
    }
  );
  return pegawai;
};
