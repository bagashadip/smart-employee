"use strict";

module.exports = (sequelize, DataTypes) => {
    const lapbul = sequelize.define(
        "tbl_lapbul",
        {
            id_lapbul: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            lapbul_periode: DataTypes.DATE,
            kode_pegawai: DataTypes.STRING,
            status: DataTypes.STRING,
            kode_pegawai_manajer: DataTypes.INTEGER,
            nip_asn: DataTypes.INTEGER,
            tanggal_ttd: DataTypes.DATE,
            namalengkap_pegawai: DataTypes.STRING,
            kode_posisi: DataTypes.STRING,
            nama_posisi: DataTypes.STRING,
            kode_dpa: DataTypes.STRING,
            nama_dpa: DataTypes.STRING,
            namalengkap_pegawai_manajer: DataTypes.STRING,
            kode_posisi_manajer: DataTypes.STRING,
            nama_posisi_manajer: DataTypes.STRING,
            kode_dpa_manajer: DataTypes.STRING,
            nama_dpa_manajer: DataTypes.STRING,
            nama_asn: DataTypes.STRING,
            jabatan_asn: DataTypes.STRING,
            nomor_halaman: DataTypes.STRING,
            kak: DataTypes.STRING
        },
        {
            freezeTableName: true,
        }
    );
    return lapbul;
};