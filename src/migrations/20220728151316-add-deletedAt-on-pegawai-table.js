"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_pegawai", "deletedAt", {
        type: Sequelize.DATE,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
