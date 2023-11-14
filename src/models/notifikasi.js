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
      judul_notifikasi: DataTypes.STRING,
      konten_notifikasi: DataTypes.TEXT,
      ikon_notifikasi: DataTypes.STRING,
      gambar_notifikasi: DataTypes.STRING,
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
