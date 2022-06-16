"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_event", {
      id_event: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      tanggal_event: {
        type: Sequelize.DATEONLY
      },
      jammulai_event: {
        type: Sequelize.TIME
      },
      jamselesai_event: {
        type: Sequelize.TIME
      },
      keterangan_event: {
        type: Sequelize.TEXT
      },
      kategori_event: {
        type: Sequelize.STRING(100)
      },
      pushnotif_event: {
        type: Sequelize.STRING(10)
      },
      kode_unitkerja: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_unitkerja",
          key: "kode_unitkerja",
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
    return queryInterface.dropTable("tbl_event");
  },
};