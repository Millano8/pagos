
import {MercadoPagoConfig, MerchantOrder, Preference} from "mercadopago"
import { MerchantOrderGetData } from "mercadopago/dist/clients/merchantOrder/get/types"

const mercadoPagoClient = new MercadoPagoConfig({accessToken: process.env.MP_TOKEN})
const merchantOrder = new MerchantOrder(mercadoPagoClient)    



export async function getMerchantOrder(orderData: MerchantOrderGetData){
    const order = await merchantOrder.get(orderData)
    return order
}


export async function createPreference(data){
    console.log("mercadoPagoConfig: ", MercadoPagoConfig.toString())
    console.log("preference: ", Preference.toString())
    const preference = await new Preference(mercadoPagoClient)

    const res = await preference.create({
        body: {
            items: data.items,
            back_urls: data.back_urls,
            notification_url: data.notification_url,
            external_reference: data.external_reference
        }
    })

    return res
}

