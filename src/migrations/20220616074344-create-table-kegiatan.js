"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_kegiatan", {
      id_kegiatan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      foto_kegiatan: {
        type: Sequelize.TEXT
      },
      nama_kegiatan: {
        type: Sequelize.STRING(200)
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbl_kegiatan");
  },
};