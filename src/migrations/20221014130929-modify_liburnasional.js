'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      
      queryInterface.addColumn("tbl_liburnasional", "createdAt", {
        type: Sequelize.DATE,
      }),

      queryInterface.addColumn("tbl_liburnasional", "updatedAt", {
        type: Sequelize.DATE,
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
