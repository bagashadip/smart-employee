"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("tbl_pegawai", "kode_divisi", {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_divisi",
          key: "kode_divisi",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
      queryInterface.changeColumn("tbl_pegawai", "kode_dpa", {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_dpa",
          key: "kode_dpa",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
