"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_organisasi", {
      id_organisasi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_organisasi: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },
      nama_organisasi: {
        type: Sequelize.STRING(100)
      },
      logo_organisasi: {
        type: Sequelize.TEXT
      },
      longitude_organisasi: {
        type: Sequelize.DOUBLE
      },
      latitude_organisasi: {
        type: Sequelize.DOUBLE
      },
      radiuslokasi_organisasi: {
        type: Sequelize.INTEGER(6)
      },
      alamat_organisasi: {
        type: Sequelize.TEXT
      },
      notelp_organisasi: {
        type: Sequelize.STRING(20)
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbl_organisasi");
  },
};
