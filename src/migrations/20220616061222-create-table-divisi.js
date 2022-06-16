"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_divisi", {
      id_divisi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_divisi: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },
      nama_divisi: {
        type: Sequelize.STRING(100)
      },
      kode_unitkerja: {
        type: Sequelize.STRING(100),
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
    return queryInterface.dropTable("tbl_divisi");
  },
};
