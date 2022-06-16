"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_message", {
      id_message: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      appid_message: {
        type: Sequelize.STRING(100)
      },
      body_message: {
        type: Sequelize.STRING(100)
      },
      kode_unitkerja: {
        type: Sequelize.STRING(30),
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbl_message");
  },
};