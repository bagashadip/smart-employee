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
      judul_notifikasi: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      konten_notifikasi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ikon_notifikasi: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      gambar_notifikasi: {
        type: Sequelize.STRING(255),
        allowNull: true
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
        allowNull: false
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
