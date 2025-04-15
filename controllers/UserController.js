import { User } from "../db/models.js";
import { compareSync, hash } from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "./generateJwt.js";

export class UserController{
    static async signup(req, res){

        const { userSnils, userPassword, roleId } = req.body;

        const candidate = await User.findOne({where: {user_snils: userSnils}})

        if(candidate){
            return res.status(403).json({message: "Пользователь с таким СНИЛС уже зарегистрирован"});
        }

        const hashPassword = await hash(userPassword, 5);
        const user = await User.create({user_snils: userSnils, user_password: hashPassword, role_id: roleId})

        const accessToken = generateAccessToken(user.user_id, user.user_snils, user.role_id);
        const refreshToken = generateRefreshToken(user.user_id, user.user_snils, user.role_id);

        res.cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 неделя
            secure: process.env.NODE_ENV !== 'development',
        });

        res.status(201).json({
            message: "Пользователь успешно зарегистрирован!",
            accessToken
        })
    }

    static async signin(req, res){
        const { userSnils, userPassword } = req.body;

        const candidate = await User.findOne({where: {user_snils: userSnils}});

        console.log("КАНДИДАТ: " + candidate);

        if(!candidate){
            return res.status(404).json({message: "Пользователь с таким СНИЛС не зарегистрирован"});
        }

        const compared = compareSync(userPassword, candidate.user_password);

        if(!compared){
            return res.status(401).json({message: "Неверный пароль"})
        }

        const accessToken = generateAccessToken(candidate.user_id, candidate.user_snils, candidate.role_id);
        const refreshToken = generateRefreshToken(candidate.user_id, candidate.user_snils, candidate.role_id);

        res.cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 неделя
            secure: process.env.NODE_ENV !== 'development',
        });

        res.status(200).json({
            message: "Пользователь успешно аутенцифицирован!",
            accessToken
        })
    }
}