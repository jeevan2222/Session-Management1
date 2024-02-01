const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("./db");
const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = User;



sequelize.sync( force=true)