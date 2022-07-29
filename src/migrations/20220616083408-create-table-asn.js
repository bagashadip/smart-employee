"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_asn", {
      id_asn: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
      },
      nip_asn: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      nama_asn: {
        type: Sequelize.STRING(100),
      },
      tanggallahir_asn: {
        type: Sequelize.DATEONLY,
      },
      jabatan_asn: {
        type: Sequelize.STRING(100),
      },
      notelp_asn: {
        type: Sequelize.STRING(20),
      },
      email_asn: {
        type: Sequelize.STRING(100),
      },
      foto_asn: {
        type: Sequelize.UUID,
      },
      statusaktif_asn: {
        type: Sequelize.STRING(20),
      },
      status_asn: {
        type: Sequelize.STRING(20),
      },
      alamat_asn: {
        type: Sequelize.TEXT,
      },
      kode_divisi: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_divisi",
          key: "kode_divisi",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      kode_jabatan: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_jabatan",
          key: "kode_jabatan",
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
    return queryInterface.dropTable("tbl_asn");
  },
};
