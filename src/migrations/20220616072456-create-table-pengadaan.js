"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_pengadaan", {
      id_pengadaan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kodeprogram_pengadaan: {
        type: Sequelize.STRING(50)
      },
      namaprogram_pengadaan: {
        type: Sequelize.STRING(100)
      },
      kodesubkegiatan_pengadaan: {
        type: Sequelize.STRING(50)
      },
      namasubkegiatan_pengadaan: {
        type: Sequelize.STRING(100)
      },
      koderinciansubkegiatan_pengadaan: {
        type: Sequelize.STRING(50)
      },
      namarinciansubkegiatan_pengadaan: {
        type: Sequelize.STRING(100)
      },
      koderekening_pengadaan: {
        type: Sequelize.STRING(50)
      },
      namarekening_pengadaan: {
        type: Sequelize.STRING(100)
      },
      tahun_pengadaan: {
        type: Sequelize.STRING(10)
      },
      nomor_spk: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_spk",
          key: "nomor_spk",
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
    return queryInterface.dropTable("tbl_pengadaan");
  },
};