"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_hakakses", {
      id_hakakses: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_hakakses: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      keterangan_hakakses: {
        type: Sequelize.STRING(100),
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
    return queryInterface.dropTable("tbl_hakakses");
  },
};
