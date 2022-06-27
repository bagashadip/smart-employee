"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_pegawai", {
      id_pegawai: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
      },
      kode_pegawai: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      namalengkap_pegawai: {
        type: Sequelize.STRING(100),
      },
      notkp_pegawai: {
        type: Sequelize.STRING(20),
      },
      jeniskelamin_pegawai: {
        type: Sequelize.STRING(30),
      },
      tanggallahir_pegawai: {
        type: Sequelize.DATEONLY,
      },
      goldarah_pegawai: {
        type: Sequelize.STRING(5),
      },
      statuspernikahan_pegawai: {
        type: Sequelize.STRING(30),
      },
      agama_pegawai: {
        type: Sequelize.STRING(20),
      },
      notelp_pegawai: {
        type: Sequelize.STRING(30),
      },
      emailpribadi_pegawai: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      emailjsc_pegawai: {
        type: Sequelize.STRING(100),
      },
      foto_pegawai: {
        type: Sequelize.UUID,
      },
      alamatktp_pegawai: {
        type: Sequelize.TEXT,
      },
      alamatdomisili_pegawai: {
        type: Sequelize.TEXT,
      },
      namakontakdarurat_pegawai: {
        type: Sequelize.STRING(100),
      },
      notelpdarurat_pegawai: {
        type: Sequelize.STRING(20),
      },
      norekening_pegawai: {
        type: Sequelize.STRING(20),
      },
      bankrekening_pegawai: {
        type: Sequelize.STRING(50),
      },
      npwp_pegawai: {
        type: Sequelize.STRING(20),
      },
      nobpjskesehatan_pegawai: {
        type: Sequelize.STRING(20),
      },
      nobpjsketenagakerjaan_pegawai: {
        type: Sequelize.STRING(20),
      },
      tanggalbergabung_pegawai: {
        type: Sequelize.DATEONLY,
      },
      tanggallulus_pegawai: {
        type: Sequelize.DATEONLY,
      },
      status_pegawai: {
        type: Sequelize.STRING(30),
      },
      ptkp_pegawai: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_ptkp",
          key: "kode_ptkp",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      kode_posisi: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_posisi",
          key: "kode_posisi",
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
    return queryInterface.dropTable("tbl_pegawai");
  },
};
