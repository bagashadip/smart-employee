"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_jamkerjadetail", "jam_datang_max", {
        type: Sequelize.TIME,
        allowNull: true
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
