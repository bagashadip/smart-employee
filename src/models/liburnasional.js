"use strict";

module.exports = (sequelize, DataTypes) => {
    const liburnasional = sequelize.define(
        "tbl_liburnasional",
        {
            id_liburnasional: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tahun: DataTypes.INTEGER,
            tanggal: DataTypes.DATE,
            nama_liburnasional: DataTypes.STRING
        },
        {
            freezeTableName: true
        },
        {
            initialAutoIncrement: 100
        }
    );
    return liburnasional;
};