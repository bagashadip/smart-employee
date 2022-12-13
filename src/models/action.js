"use strict";

module.exports = (sequelize, DataTypes) => {
  const action = sequelize.define(
    "action",
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

  return action;
};