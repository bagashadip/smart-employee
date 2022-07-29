"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_user", "otp_secret", {
        type: Sequelize.TEXT,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
