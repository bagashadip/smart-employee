"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_pekerjaan", {
      id_pekerjaan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      namainstansi_pekerjaan: {
        type: Sequelize.STRING(100)
      },
      namapaket_pekerjaan: {
        type: Sequelize.STRING(100)
      },
      posisi_pekerjaan: {
        type: Sequelize.STRING(100)
      },
      lingkup_pekerjaan: {
        type: Sequelize.TEXT
      },
      namaatasan_pekerjaan: {
        type: Sequelize.STRING(100)
      },
      alamatinstansi_pekerjaan: {
        type: Sequelize.TEXT
      },
      notelpinstansi_pekerjaan: {
        type: Sequelize.TEXT
      },
      gaji_pekerjaan: {
        type: Sequelize.DECIMAL
      },
      tanggalmulai_pekerjaan: {
        type: Sequelize.DATEONLY
      },
      tanggalselesai_pekerjaan: {
        type: Sequelize.DATEONLY
      },
      nokontrak_pekerjaan: {
        type: Sequelize.STRING(30)
      },
      status_pekerjaan: {
        type: Sequelize.STRING(20)
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
    return queryInterface.dropTable("tbl_pekerjaan");
  },
};