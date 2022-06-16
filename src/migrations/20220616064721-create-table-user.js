"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_user", {
      id_user: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      username_user: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password_user: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status_user: {
        type: Sequelize.STRING(20)
      },
      attempt_user: {
        type: Sequelize.INTEGER(1)
      },
      lastlogin_user: {
        type: Sequelize.DATE
      },
      onesignalid_user: {
        type: Sequelize.STRING(30),
        unique: true
      },
      token_user: {
        type: Sequelize.STRING(255)
      },
      kode_pegawai: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_pegawai",
          key: "kode_pegawai",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      kode_role: {
        type: Sequelize.STRING(30),
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
    return queryInterface.dropTable("tbl_user");
  },
};