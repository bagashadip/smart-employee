"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_permission", {
      id_permission: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_hakakses: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_hakakses",
          key: "kode_hakakses",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      kode_role: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_role",
          key: "kode_role",
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
    return queryInterface.dropTable("tbl_permission");
  },
};
