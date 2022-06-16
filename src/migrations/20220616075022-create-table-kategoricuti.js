"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_kategoricuti", {
      id_kategoricuti: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_kategoricuti: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false
      },
      keterangan_kategoricuti: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable("tbl_kategoricuti");
  },
};