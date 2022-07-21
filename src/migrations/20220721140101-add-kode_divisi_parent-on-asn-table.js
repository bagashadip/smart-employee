"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_asn", "kode_divisi_parent", {
        type: Sequelize.STRING,
        references: {
          model: "tbl_divisi_parent",
          key: "kode_divisi_parent",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
