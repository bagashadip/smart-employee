"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_dpa", {
      id_dpa: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_dpa: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      nama_dpa: {
        type: Sequelize.STRING(100),
      },
      grade_dpa: {
        type: Sequelize.INTEGER(11),
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
    return queryInterface.dropTable("tbl_dpa");
  },
};
