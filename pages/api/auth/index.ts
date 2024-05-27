import {NextApiRequest,NextApiResponse} from "next"
import {authMiddleware} from "lib/middlewares"
import { User } from "lib/user"
import {sendCode} from "lib/controllers/auth"

export default async function (req:NextApiRequest,res:NextApiResponse, token){
    const result = await sendCode(req.body.email)

    res.send(result)
}

