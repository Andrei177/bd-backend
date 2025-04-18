import { User } from "../db/models.js";
import { generateAccessToken, generateRefreshToken } from "./generateJwt.js";
import jwt from "jsonwebtoken"

export class AuthController {
    static async refresh(req, res) {
        try{

            const cookieHeader = req.headers.cookie;

            if (!cookieHeader) {
                return res.status(401).json({ message: "Куки отсутствуют" });
            }
             // Парсинг кук в объект
            const cookies = Object.fromEntries(
                cookieHeader.split(';').map(c => {
                    const [key, val] = c.trim().split('=');
                    return [key, val];
                })
            );

            const refreshToken = cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: "Отсутствует refresh токен" });
            }
    
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
            }
            catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Refresh токен истёк" });
                }
                return res.status(401).json({ message: "Недействительный refresh токен" });
            }
    
            const candidate = await User.findOne({ where: { user_id: decoded.userId } })
    
            if (!candidate) {
                return res.status(401).json({ message: "Пользователь не найден" });
            }
    
            const newAccessToken = generateAccessToken(candidate.user_id, candidate.user_snils, candidate.role_id);
            const newRefreshToken = generateRefreshToken(candidate.user_id, candidate.user_snils, candidate.role_id);
    
            res.cookie('refreshToken', newRefreshToken, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 1 неделя
                secure: process.env.NODE_ENV !== 'development',
            });
    
            return res.status(200).json({
                message: "Токены успешно обновлены",
                accessToken: newAccessToken
            })
        }catch(err){
            return res.status(500).json({message: "Ошибка при обновлении токенов"})
        }
    }
}