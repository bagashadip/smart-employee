'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.dropTable('tbl_role');
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
