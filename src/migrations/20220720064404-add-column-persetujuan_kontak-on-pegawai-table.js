"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_pegawai", "persetujuan_kontak", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
