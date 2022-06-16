"use strict";

module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "tbl_role",
    {
      id_role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kode_role: DataTypes.STRING,
      keterangan_role: DataTypes.STRING
    },
    {}
  );
  return role;
};
