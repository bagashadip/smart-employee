"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_jabatan", "urutan_jabatan", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
