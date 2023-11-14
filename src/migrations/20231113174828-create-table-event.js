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
    return queryInterface.createTable("tbl_event", {
      id_event: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      nama_event: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      tanggal_event: {
        type: Sequelize.DATE,
        allowNull: false
      },
      jammulai_event: {
        type: Sequelize.TIME,
        allowNull: true
      },
      jamselesai_event: {
        type: Sequelize.TIME,
        allowNull: true
      },
      keterangan_event: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      gambar_event: {
        type: Sequelize.STRING(250),
        allowNull: true
      },
      kategori_event: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      recipient_event: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pic_event: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      divisi_event: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      is_push_event: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      push_date_event: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status_event: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable("tbl_event");
  }
};
