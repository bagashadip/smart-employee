"use strict";

module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define(
    "tbl_event",
    {
      id_event: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }, 
      nama_event: DataTypes.STRING,
      tanggal_event: DataTypes.DATE,
      jammulai_event: DataTypes.TIME,
      jamselesai_event: DataTypes.TIME,
      keterangan_event: DataTypes.TEXT,
      gambar_event: DataTypes.STRING,
      kategori_event: DataTypes.STRING,
      recipient_event: DataTypes.TEXT,
      pic_event: DataTypes.STRING,
      divisi_event: DataTypes.STRING,
      is_push_event: DataTypes.BOOLEAN,
      push_date_event: DataTypes.DATE,
      status_event: DataTypes.STRING,      
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      freezeTableName: true,
    }
  );
  return event;
};
