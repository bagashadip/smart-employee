"use strict";

module.exports = (sequelize, DataTypes) => {
    const kegiatan = sequelize.define(
        "tbl_kegiatan",
        {
            id_kegiatan: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            foto_kegiatan: DataTypes.UUID,
            desc_kegiatan: DataTypes.TEXT,
            nama_kegiatan: DataTypes.STRING,
            tanggal_kegiatan: DataTypes.DATE,
            waktu_kegiatan_mulai: DataTypes.TIME,
            waktu_kegiatan_selesai: DataTypes.TIME,
            kode_pegawai: DataTypes.STRING
        },
        {
            freezeTableName: true,
        }
    );
    return kegiatan;
};