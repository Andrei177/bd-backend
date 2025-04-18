import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { sequelize } from "./db/db.js";
import { router } from "./router/router.js";

const app = express();
const PORT = process.env.PORT || 5000;


const whitelist = [
    'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    maxAge: 86400 // Кеширование CORS-префлайт запросов (24ч)
}));

app.use(express.json());

app.use("/api", router);

app.get("/", async (req, res) => {
    res.json({ message: "Привет!" });
})

async function startApp() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, (err) => {
            if (err) console.log("Ошибка при прослушивании порта", err)
            else console.log(`Сервер запущен на ${PORT} порту`)
        })
    }
    catch (err) {
        console.log("Ошибка при запуске приложения", err);
        process.exit(1);
    }
}

startApp();