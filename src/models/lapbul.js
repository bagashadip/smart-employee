"use strict";

module.exports = (sequelize, DataTypes) => {
    const kegiatan = sequelize.define(
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
            
        },
        {
            freezeTableName: true,
        }
    );
    return kegiatan;
};