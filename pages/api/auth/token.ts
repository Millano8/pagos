import {NextApiRequest,NextApiResponse} from "next"
import { generate } from "lib/jwt"
import { Auth } from "lib/auth"

export default async function (req:NextApiRequest,res:NextApiResponse){
    const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code)
    if(!auth){
        res.status(401).send({
            message: "email or code incorrecto"
        })
    }
    const expires = auth.isCodeExpired()
    if (expires){
        res.status(401).send({
            message: "code expirado"
        })
    }

    const token = generate({userId: auth.data.userId})
    res.send({token})

    
}

