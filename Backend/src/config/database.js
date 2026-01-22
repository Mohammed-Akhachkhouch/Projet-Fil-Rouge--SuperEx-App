import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(

    {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log("Error connecting to DB:", err));
