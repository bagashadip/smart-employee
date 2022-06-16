"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_config", {
      id_config: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      googlemap_apikey: {
        type: Sequelize.STRING(100)
      },
      onesignal_apikey: {
        type: Sequelize.STRING(100)
      },
      smtp_host: {
        type: Sequelize.STRING(100)
      },
      smtp_username: {
        type: Sequelize.STRING(100)
      },
      smtp_password: {
        type: Sequelize.STRING(100)
      },
      smptp_port: {
        type: Sequelize.INTEGER(11)
      },
      fromname_email: {
        type: Sequelize.STRING(100)
      },
      email_noreply: {
        type: Sequelize.STRING(100)
      },
      email_admin: {
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
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbl_config");
  },
};