"use strict";

module.exports = (sequelize, DataTypes) => {
  const status = sequelize.define(
    "status",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      action: DataTypes.STRING,
      color: DataTypes.STRING,
      createdBy: DataTypes.UUID,
      updatedBy: DataTypes.UUID,
    },
    {}
  );

  return status;
};
