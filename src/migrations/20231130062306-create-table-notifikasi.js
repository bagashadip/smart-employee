'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("tbl_notifikasi", {
      id_notifikasi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      reminder_title1_notifikasi: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      reminder_title2_notifikasi: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      reminder_date1_notifikasi: {
        type: Sequelize.DATE,
        allowNull: true
      },
      reminder_date2_notifikasi: {
        type: Sequelize.DATE,
        allowNull: true
      },
      main_title_notifikasi: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      main_konten_notifikasi: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      tipe_notifikasi: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      data_notifikasi: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
      },
      send_date_notifikasi: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_read_notifikasi: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      data_user_notifikasi: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
      },
      onesignal_id_notifikasi: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("tbl_notifikasi");
  }
};
