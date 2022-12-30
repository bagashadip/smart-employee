"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_jamkerja", {
      id_jamkerja: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_jamkerja: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },
      tampil_jamkerja: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    return queryInterface.dropTable("tbl_jamkerja");
  },
};