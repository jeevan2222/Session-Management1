const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Test", "postgres", "admin", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false, // This line is crucial for Render
    // },
  },
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
module.exports = sequelize;
