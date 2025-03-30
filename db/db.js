import { Sequelize } from "sequelize"
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: "postgres",
    host: "localhost",
    port: 5432,
})