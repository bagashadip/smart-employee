"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_pegawai", "onesignal_id", {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
