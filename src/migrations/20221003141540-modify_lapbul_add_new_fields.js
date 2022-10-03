'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      
      queryInterface.addColumn("tbl_lapbul", "kode_pegawai_manajer", {
        type: Sequelize.STRING,
        references: {
          model: "tbl_pegawai",
          key: "kode_pegawai",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),

      queryInterface.addColumn("tbl_lapbul", "nip_asn", {
        type: Sequelize.STRING,
        references: {
          model: "tbl_asn",
          key: "nip_asn",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),

      queryInterface.addColumn("tbl_lapbul", "tanggal_ttd", {
        type: Sequelize.DATE,
      }),

      queryInterface.addColumn("tbl_lapbul", "namalengkap_pegawai", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "kode_posisi", {
        type: Sequelize.STRING(30)
      }),

      queryInterface.addColumn("tbl_lapbul", "nama_posisi", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "kode_dpa", {
        type: Sequelize.STRING(30)
      }),

      queryInterface.addColumn("tbl_lapbul", "nama_dpa", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "namalengkap_pegawai_manajer", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "kode_posisi_manajer", {
        type: Sequelize.STRING(30)
      }),

      queryInterface.addColumn("tbl_lapbul", "nama_posisi_manajer", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "kode_dpa_manajer", {
        type: Sequelize.STRING(30)
      }),

      queryInterface.addColumn("tbl_lapbul", "nama_dpa_manajer", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "nama_asn", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "jabatan_asn", {
        type: Sequelize.STRING(100)
      }),

      queryInterface.addColumn("tbl_lapbul", "nomor_halaman", {
        type: Sequelize.STRING(100)
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
