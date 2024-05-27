import {NextApiRequest,NextApiResponse} from "next"
import {authMiddleware} from "lib/middlewares"
import { User } from "lib/user"
import {createPreference} from "lib/mercadopago"
import method from "micro-method-router"
import { Order } from "lib/models/order"

const products = {
    1234: {
        title: "Mate",
        price: 100,

    }
}

async function postHandler(req:NextApiRequest,res:NextApiResponse, token){
    const {productId} = req.query as any
    const product = products[productId]
    console.log("product: ",product)

    if(!product){
        res.status(404).json({message: "el producto no existe"})
    }

    
    const order = await Order.createNewOrder({
        aditional_info: req.body,
        productId,
        userId: token.userId,
        status : "pending"
    })

    const pref = await createPreference(
      {
        external_reference: order.id,
        back_urls: {
          "success": "http://google.com"
        },
        items: [
          {
            "id": "Mate de caoba",
            "title": product.title,
            "description": "Mate cheto",
            "picture_url": "http://www.myapp.com/myimage.jpg",
            "category_id": "car_electronics",
            "quantity": 1,
            "currency_id": "ARS",
            "unit_price": product.price
          }
        ],
        notification_url: "https://pagos-five.vercel.app/api/webhooks/mercadopago",
      }
    )
    res.send({url:pref.init_point})
}

const handler = method({
    post: postHandler
})

export default authMiddleware(handler)