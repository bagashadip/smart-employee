"use strict";

module.exports = (sequelize, DataTypes) => {
  const arsipLapbulLog = sequelize.define(
    "tbl_arsip_lapbul_log",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      arsip_lapbul_id: DataTypes.UUID,
      note: DataTypes.TEXT,
      status: DataTypes.STRING
    },
    {
      freezeTableName: true,
    }
  );
  return arsipLapbulLog;
};
