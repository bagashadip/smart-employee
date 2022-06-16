"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_spk", {
      id_spk: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      nomor_spk: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      namapekerjaan_spk: {
        type: Sequelize.STRING(100)
      },
      tanggalmulai_spk: {
        type: Sequelize.DATEONLY
      },
      tanggalselesai_spk: {
        type: Sequelize.DATEONLY
      },
      noundanganpengadaan_spk: {
        type: Sequelize.STRING(50)
      },
      tglundanganpengadaan_spk: {
        type: Sequelize.DATEONLY
      },
      nobahasilpengadaan_spk: {
        type: Sequelize.STRING(50)
      },
      tglbahasilpengadaan_spk: {
        type: Sequelize.DATEONLY
      },
      nomorpaket_spk: {
        type: Sequelize.INTEGER(2)
      },
      totalnominal_spk: {
        type: Sequelize.INTEGER(11)
      },
      totalbulan_spk: {
        type: Sequelize.INTEGER(2)
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
    return queryInterface.dropTable("tbl_spk");
  },
};