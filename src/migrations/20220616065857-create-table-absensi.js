"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_absensi", {
      id_absensi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
      },
      foto_absensi: {
        type: Sequelize.UUID,
      },
      longitude_absensi: {
        type: Sequelize.DOUBLE,
      },
      latitude_absensi: {
        type: Sequelize.DOUBLE,
      },
      label_absensi: {
        type: Sequelize.STRING(20),
      },
      catatan_absensi: {
        type: Sequelize.TEXT,
      },
      tipe_absensi: {
        type: Sequelize.STRING(20),
      },
      timestamp_absensi: {
        type: Sequelize.DATE,
      },
      kode_pegawai: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_pegawai",
          key: "kode_pegawai",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbl_absensi");
  },
};
