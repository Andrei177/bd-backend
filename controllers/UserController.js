export class UserController{
    static async createUser(req, res){
        res.json({message: "пользователь создан"})
    }
}