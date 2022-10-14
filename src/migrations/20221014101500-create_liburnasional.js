'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("tbl_liburnasional", {
      id_liburnasional: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      tahun: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      nama_liburnasional: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
    });
  },
  
  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("tbl_liburnasional");
  }
};
