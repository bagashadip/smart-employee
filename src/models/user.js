"use strict";
const mRole = require("./role");
const { includes } = require("lodash");

module.exports = (sequelize, DataTypes) => {
  const Role = mRole(sequelize, DataTypes);
  const user = sequelize.define(
    "tbl_user",
    {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username_user: DataTypes.STRING,
      password_user: DataTypes.STRING,
      status_user: DataTypes.STRING,
      attempt_user: DataTypes.INTEGER,
      lastlogin_user: DataTypes.DATE,
      onesignal_user: {
        type: DataTypes.STRING,
        unique: true,
      },
      token_user: DataTypes.STRING,
      kode_pegawai: DataTypes.STRING,
      kode_role: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  user.addScope("withoutPassword", {
    attributes: { exclude: ["password_user"] },
  });

  // Protect Password
  user.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.password_user;
    return values;
  };

  // Check if role user has access to module and action
  user.prototype.hasAccess = async function (module, action) {
    // Uncomment to disable role validation
    // return true;

    const role = await Role.findByPk(this.kode_role, {
      attributes: ["permissions"],
    });
    let isAuth = true;
    if (role) {
      if (role.permissions[module]) {
        if (!includes(role.permissions[module], action)) {
          isAuth = false;
        }
      } else {
        isAuth = false;
      }
    } else {
      isAuth = false;
    }

    return isAuth;
  };
  return user;
};
