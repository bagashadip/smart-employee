"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_asn", "kode_divisi", {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_divisi",
          key: "kode_divisi",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
