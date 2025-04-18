import jwt from "jsonwebtoken";
import { User } from "../../db/models";

export class AuthMiddleware{
    static async validateAccessToken(req, res, next){
        try{
            const authHeader = req.headers.authorization; 
            const accessToken = authHeader.split(" ")[1]; // токен будет приходить в формате Bearer fas.sdf.sdf
    
            if(!accessToken) return res.status(401).json({message: "Нет access токена"});
    
            let decoded;
            try{
                decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
            }
            catch(err){
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Access токен истёк" });
                }
                return res.status(401).json({ message: "Недействительный access токен" });
            }
    
            const candidate = await User.findOne({where: {user_id: decoded.userId}})
    
            if(!candidate){
                return res.status(401).json({message: "Пользователь не найден"});
            }

            // для следующего обработчика сразу добавил инфу о пользователе, чтобы в БД снова не обращаться
            req.user = {
                id: candidate.user_id,
                snils: candidate.user_snils,
                role: candidate.role_id
            };
    
            return next();
        } catch(err){
            return res.status(500).json({message: "Ошибка на сервере при проверке токена"})
        }
    }
}