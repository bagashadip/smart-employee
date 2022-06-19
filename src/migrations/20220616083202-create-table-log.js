"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_log", {
      id_log: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      aktivitas_log: {
        type: Sequelize.TEXT
      },
      ipaddress_log: {
        type: Sequelize.STRING(50)
      },
      username_user: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_user",
          key: "username_user",
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
    return queryInterface.dropTable("tbl_log");
  },
};