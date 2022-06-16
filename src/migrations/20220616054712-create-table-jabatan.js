"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_jabatan", {
      id_jabatan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_jabatan: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      nama_jabatan: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
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
    return queryInterface.dropTable("tbl_jabatan");
  },
};
