"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_kegiatan", {
      id_kegiatan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      foto_kegiatan: {
        type: Sequelize.UUID
      },
      desc_kegiatan: {
        type: Sequelize.TEXT
      },
      nama_kegiatan: {
        type: Sequelize.TEXT
      },
      tanggal_kegiatan: {
        type: Sequelize.DATEONLY
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
      waktu_kegiatan_mulai : {
        type: Sequelize.TIME
      },
      waktu_kegiatan_selesai : {
        type: Sequelize.TIME
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbl_kegiatan");
  },
};