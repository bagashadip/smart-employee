"use strict";

module.exports = (sequelize, DataTypes) => {
  const log = sequelize.define(
    "tbl_log",
    {
        id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      aktivitas_log: DataTypes.TEXT,
      ipaddress_log: DataTypes.STRING,
      username_user: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );
  return log;
};
