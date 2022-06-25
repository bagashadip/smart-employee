"use strict";

module.exports = (sequelize, DataTypes) => {
  const fileCategory = sequelize.define(
    "fileCategory",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      allowedExtension: DataTypes.JSON,
      maxFileSize: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      createdBy: DataTypes.UUID,
      updatedBy: DataTypes.UUID,
    },
    {}
  );

  return fileCategory;
};
