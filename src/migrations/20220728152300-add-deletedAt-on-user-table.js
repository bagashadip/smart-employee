"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_user", "deletedAt", {
        type: Sequelize.DATE,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
