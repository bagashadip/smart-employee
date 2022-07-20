"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_posisi", "urutan_posisi", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
