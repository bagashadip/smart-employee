"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbl_unitkerja", {
      id_unitkerja: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        autoIncrement: true
      },
      kode_unitkerja: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },
      nama_unitkerja: {
        type: Sequelize.STRING(100)
      },
      logo_unitkerja: {
        type: Sequelize.TEXT
      },
      longitude_unitkerja: {
        type: Sequelize.DOUBLE
      },
      latitude_unitkerja: {
        type: Sequelize.DOUBLE
      },
      radiuslokasi_unitkerja: {
        type: Sequelize.INTEGER(6)
      },
      alamat_unitkerja: {
        type: Sequelize.TEXT
      },
      notelp_unitkerja: {
        type: Sequelize.STRING(20)
      },
      kode_organisasi: {
        type: Sequelize.STRING(100),
        references: {
          model: "tbl_organisasi",
          key: "kode_organisasi",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    return queryInterface.dropTable("tbl_unitkerja");
  },
};
