import { firestore } from "./firestore";
import { isAfter } from "date-fns";

const collection= firestore.collection("auth")

export class Auth{
    ref:FirebaseFirestore.DocumentData
    data: any
    id: string
    constructor(id){
        this.id = id
        this.ref= collection.doc(id)
    }
    async pull(){
        const snap = await this.ref.get()
        this.data = snap.data()
    }
    async push(){
        this.ref.update(this.data)
    }
    static async findByEmail(email:string){
        const cleanEmail = email.trim().toLocaleLowerCase()
        const results = await collection.where("email","==",cleanEmail).get()
        if(results.docs.length){
            const first = results.docs[0]
            const newAuth = new Auth(first.id)
            newAuth.data = first.data()
            return newAuth
        } else {
            return null
        }
    }
    static async createNewAuth(data){
        const newAuthSnap = await collection.add(data)
        const newAuth = new Auth(newAuthSnap.id)
        newAuth.data = data
        return newAuth
    }
    isCodeExpired(){
        const now = new Date()
        const expires = this.data.expires.toDate() 
        console.log("Expires: ", expires)
        console.log("Now: ", now)
        return isAfter(now,expires)
    }
    static async findByEmailAndCode(email:string,code:number){
        const cleanEmail = email.trim().toLowerCase()
        const result = await collection.where("email","==",cleanEmail).where("code","==",code).get()

        if (result.empty){
            console.error("email y code no coinciden")
            return null
        } else {
            const doc = result.docs[0]
            const auth = new Auth(doc.id)
            auth.data = doc.data()
            return auth
        }


    }
}