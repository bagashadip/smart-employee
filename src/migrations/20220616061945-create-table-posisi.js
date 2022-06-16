"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_posisi", {
      id_posisi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_posisi: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      nama_posisi: {
        type: Sequelize.STRING(100),
      },
      kode_careerpath: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_careerpath",
          key: "kode_careerpath",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      kode_dpa: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_dpa",
          key: "kode_dpa",
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
    return queryInterface.dropTable("tbl_posisi");
  },
};
