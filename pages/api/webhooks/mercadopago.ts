import type {NextApiRequest, NextApiResponse} from "next"
import { getMerchantOrder } from "lib/mercadopago"
import { Order } from "lib/models/order"

export default async function(req:NextApiRequest,res:NextApiResponse){
    const {id, topic} = req.query
    if (topic == "merchant_order"){
        const order = await getMerchantOrder({merchantOrderId:id as string | number})
        if (order.order_status == "paid"){
            // aca voy a la collection de firebase y ese orderId deberia tener asociado el userId
            // ese userId es quien genero la orden y realizo la compra, es a quien le enviamos el mail
            const orderId = order.external_reference
            const myOrder = new Order(orderId)
            await myOrder.pull()

            myOrder.data.status = "closed"
            await myOrder.push()
            // sendEmail("tu pago fue confirmado")
            // sendEmailInterno("alguien compro algo")

        }
    }
    res.send("ok")

}