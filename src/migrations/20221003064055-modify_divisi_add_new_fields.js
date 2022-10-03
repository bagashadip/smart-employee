'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      
      queryInterface.addColumn("tbl_divisi", "kode_pegawai_manajer", {
        type: Sequelize.STRING,
        references: {
          model: "tbl_pegawai",
          key: "kode_pegawai",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),

      queryInterface.addColumn("tbl_divisi", "nip_asn", {
        type: Sequelize.STRING,
        references: {
          model: "tbl_asn",
          key: "nip_asn",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
