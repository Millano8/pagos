import parseBearerToken from "parse-bearer-token"
import {NextApiRequest,NextApiResponse} from "next"
import {decode} from "lib/jwt"

export function authMiddleware(callback){
    return function(req:NextApiRequest,res:NextApiResponse){
        const token = parseBearerToken(req)
        if(!token){
            res.status(401).send({message: "no hay token"})
        }
        const decodedToken = decode(token)
        if(decodedToken){
            callback(req,res, decodedToken)
        } else {
            res.status(401).send({message: "el token es incorrecto"})
        }
    }
}