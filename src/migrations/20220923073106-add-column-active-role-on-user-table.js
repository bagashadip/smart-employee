"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("tbl_user", "activeRole", {
        type: Sequelize.UUID,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
