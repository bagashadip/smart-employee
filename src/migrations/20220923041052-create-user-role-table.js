"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("userRoles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "tbl_user",
          key: "id_user",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      roles: {
        type: Sequelize.JSON,
      },
      createdBy: {
        type: Sequelize.UUID,
      },
      updatedBy: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("userRoles");
  },
};
