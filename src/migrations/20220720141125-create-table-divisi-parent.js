"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_divisi_parent", {
      id_divisi_parent: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
      },
      kode_divisi_parent: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nama_divisi_parent: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable("tbl_divisi_parent");
  },
};
