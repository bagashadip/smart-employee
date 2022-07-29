"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_user", "first_login", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
