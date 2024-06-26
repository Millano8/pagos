import { database } from "firebase-admin";
import { firestore } from "../firestore";

const collection= firestore.collection("orders")

type OrderData = {
    status: "pending" | "paid"  
}


export class Order{
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
    static async createNewOrder(newOrderData={}){
        const newOrderSnap = await collection.add(newOrderData)
        const newOrder = new Order(newOrderSnap.id)
        newOrder.data = newOrderData
        return newOrder
    }
}