"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_jamkerjadetail", "durasi_kerja", {
        type: Sequelize.TIME,
        allowNull: true
      }),
      queryInterface.addColumn("tbl_jamkerjadetail", "jam_pulang_max", {
        type: Sequelize.TIME,
        allowNull: true
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
