"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_careerpath", {
      id_careerpath: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_careerpath: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      nama_careerpath: {
        type: Sequelize.STRING(100),
      },
      kode_divisi: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_divisi",
          key: "kode_divisi",
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
    return queryInterface.dropTable("tbl_careerpath");
  },
};
