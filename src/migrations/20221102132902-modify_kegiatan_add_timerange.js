'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      
      queryInterface.addColumn("tbl_kegiatan", "waktu_kegiatan_mulai", {
        type: Sequelize.TIME,
      }),

      queryInterface.addColumn("tbl_kegiatan", "waktu_kegiatan_selesai", {
        type: Sequelize.TIME,
      }),

    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
