"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_absensi", "time_limit_datang", {
        type: Sequelize.TIME,
      }),
      queryInterface.addColumn("tbl_absensi", "time_limit_pulang", {
        type: Sequelize.TIME,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
