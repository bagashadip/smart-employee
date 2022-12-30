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
      
      queryInterface.addColumn("tbl_lapbul", "uraian_periode", {
        type: Sequelize.TEXT,
      }),

      queryInterface.addColumn("tbl_lapbul", "uraian_pelaksanaan", {
        type: Sequelize.TEXT,
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
