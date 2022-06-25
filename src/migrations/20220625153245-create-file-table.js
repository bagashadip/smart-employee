"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("files", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      fileCategoryId: {
        type: Sequelize.UUID,
        references: {
          model: "fileCategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: Sequelize.STRING(255),
      },
      size: {
        type: Sequelize.INTEGER,
      },
      extension: {
        type: Sequelize.STRING(50),
      },
      path: {
        type: Sequelize.STRING(255),
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("files");
  },
};
