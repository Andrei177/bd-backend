import jwt from "jsonwebtoken"

export const generateAccessToken = (userId, userSnils, roleId) => {
    return jwt.sign({userId, userSnils, roleId}, process.env.ACCESS_SECRET_KEY, {expiresIn: "15m"})
}
export const generateRefreshToken = (userId, userSnils, roleId) => {
    return jwt.sign({userId, userSnils, roleId}, process.env.REFRESH_SECRET_KEY, {expiresIn: "5d"})
}