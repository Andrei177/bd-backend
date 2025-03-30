import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { sequelize } from "./db/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.json({message: "Привет!"});
})

async function startApp(){
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, (err) => {
            if(err) console.log("Ошибка при прослушивании порта", err)
            else console.log(`Сервер запущен на ${PORT} порту`)
        })
    }
    catch(err){
        console.log("Ошибка при запуске приложения", err);
        process.exit(1);
    }
}

startApp();