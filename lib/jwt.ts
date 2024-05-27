import jwt from "jsonwebtoken"


export function generate(obj){
    var token = jwt.sign(obj, process.env.JWT_SECRET)
    return token
}

export function decode(token){
    try{
        var decoded = jwt.verify(token,process.env.JWT_SECRET)
        return decoded
    } catch(e){
        console.error("Token incorrecto")
        return null
    }
}