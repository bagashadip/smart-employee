"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_jamkerjadetail", {
      id_jamkerjadetail: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      nama_jamkerjadetail: {
        type: Sequelize.STRING
      },
      jam_datang: {
        type: Sequelize.TIME,
      },
      jam_pulang: {
        type: Sequelize.TIME,
      },
      kode_jamkerja: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_jamkerja",
          key: "kode_jamkerja",
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
    return queryInterface.dropTable("tbl_jamkerjadetail");
  },
};