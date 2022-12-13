"use strict";

module.exports = (sequelize, DataTypes) => {
  const module = sequelize.define(
    "module",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      createdBy: DataTypes.UUID,
      updatedBy: DataTypes.UUID,
    },
    {}
  );
  return module;
};
