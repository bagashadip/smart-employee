"use strict";

module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define(
    "file",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      fileCategoryId: DataTypes.UUID,
      type: DataTypes.STRING,
      size: DataTypes.INTEGER,
      extension: DataTypes.STRING,
      path: DataTypes.STRING,
      createdBy: DataTypes.UUID,
      updatedBy: DataTypes.UUID,
    },
    {}
  );

  return file;
};
