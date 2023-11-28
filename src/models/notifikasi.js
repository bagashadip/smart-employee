"use strict";

module.exports = (sequelize, DataTypes) => {
  const notifikasi = sequelize.define(
    "tbl_notifikasi",
    {
      id_notifikasi: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      reminder_title1_notifikasi: DataTypes.STRING,
      reminder_title2_notifikasi: DataTypes.STRING,
      reminder_date1_notifikasi: DataTypes.DATE,
      reminder_date2_notifikasi: DataTypes.DATE,
      tipe_notifikasi: DataTypes.STRING,
      data_notifikasi: DataTypes.JSON,
      send_date_notifikasi: DataTypes.DATE,
      is_read_notifikasi: DataTypes.BOOLEAN,
      data_user_notifikasi: DataTypes.JSON,
      onesignal_id_notifikasi: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  return notifikasi;
};
