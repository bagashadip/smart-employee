"use strict";

module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define(
    "tbl_permission",
    {
        id_permission: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      kode_hakakses: DataTypes.STRING,
      kode_role: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return permission;
};
