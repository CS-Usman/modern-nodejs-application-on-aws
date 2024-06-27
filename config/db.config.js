import { Sequelize } from "sequelize";
import "dotenv/config";

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: "localhost",
  dialect: "postgres",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDB;
