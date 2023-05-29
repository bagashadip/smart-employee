"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_user", "nip_asn", {
        type: Sequelize.STRING(30),
        references: {
          model: "tbl_asn",
          key: "nip_asn",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
