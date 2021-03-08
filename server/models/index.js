const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,

  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
//test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres Connected!");
  } catch (error) {
    console.error(err);
  }
})();

module.exports = sequelize;
