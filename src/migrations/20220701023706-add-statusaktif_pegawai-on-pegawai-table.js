"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_pegawai", "statusaktif_pegawai", {
        type: Sequelize.STRING,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
