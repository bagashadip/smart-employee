"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_cuti", {
      id_cuti: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      tanggalmulai_cuti: {
        type: Sequelize.DATEONLY
      },
      tanggalselesai_cuti: {
        type: Sequelize.DATEONLY
      },
      alamat_cuti: {
        type: Sequelize.TEXT
      },
      kontak_cuti: {
        type: Sequelize.STRING(20)
      },
      kode_kategoricuti: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_kategoricuti",
          key: "kode_kategoricuti",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      kode_pegawai_pengganti: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_pegawai",
          key: "kode_pegawai",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    return queryInterface.dropTable("tbl_cuti");
  },
};