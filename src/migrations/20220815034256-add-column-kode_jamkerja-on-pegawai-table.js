"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_pegawai", "kode_jamkerja", {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_jamkerja",
          key: "kode_jamkerja",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
