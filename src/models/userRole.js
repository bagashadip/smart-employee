"use strict";

module.exports = (sequelize, DataTypes) => {
  const userRole = sequelize.define(
    "userRole",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.INTEGER,
      roles: DataTypes.JSON,
      createdBy: DataTypes.UUID,
      updatedBy: DataTypes.UUID,
    },
    {}
  );

  return userRole;
};
