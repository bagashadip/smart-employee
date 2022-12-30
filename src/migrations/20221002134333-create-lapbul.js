'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("tbl_lapbul", {
      id_lapbul: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      lapbul_periode: {
        type: Sequelize.DATE,
        allowNull: false
      },
      kode_pegawai: {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_pegawai",
          key: "kode_pegawai",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("tbl_lapbul");
  }
};
