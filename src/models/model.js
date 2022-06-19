const Sequelize = require("sequelize");
const sequelize = require("../util/database");


const mUser = require("./user");
const mJabatan = require("./jabatan");
const mLog = require("./log");
const mRole = require("./role");

const User = mUser(sequelize, Sequelize);
const Jabatan = mJabatan(sequelize, Sequelize);
const Log = mLog(sequelize, Sequelize);

async function authenticate() {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  authenticate();
  
  module.exports = {
    User,
    Jabatan,
    Log
  };