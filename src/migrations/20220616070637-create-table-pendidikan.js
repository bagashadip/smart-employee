"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_pendidikan", {
      id_pendidikan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      namainstansi_pendidikan: {
        type: Sequelize.STRING(100)
      },
      jenjang_pendidikan: {
        type: Sequelize.STRING(20)
      },
      prodi_pendidikan: {
        type: Sequelize.STRING(100)
      },
      gpa_pendidikan: {
        type: Sequelize.DOUBLE
      },
      tahunmasuk_pendidikan: {
        type: Sequelize.STRING(10)
      },
      tanggalijazah_pendidikan: {
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
    return queryInterface.dropTable("tbl_pendidikan");
  },
};