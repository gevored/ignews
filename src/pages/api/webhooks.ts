import { NextApiRequest, NextApiResponse } from "next";
import {Readable} from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer (readble: Readable){
    const chunks = []

    for await (const chunk of readble){
        chunks.push( typeof chunk === "string" ? Buffer.from(chunk):chunk)
    }
    return Buffer.concat(chunks)
}

//disbled the default read of NEXT to consume streaming webhook from stripe 
export const config = {
    api: {
      bodyParser: false
    }
}

const relevantEvents = new Set([    
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
])

export default async function(req:NextApiRequest, res:NextApiResponse){
    if(req.method === 'POST'){
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event : Stripe.Event;

        //checking if the request is from stripe
        try{
            event = stripe.webhooks.constructEvent(buf,secret,process.env.STRIPE_WEBHOOK_SECRET)  
           
        }catch(err){
            return res.status(400).json({
                error: err.message
            })
        }
        
        const {type} = event

        try {
            if(relevantEvents.has(type)){
                switch (type) {

                    //case 'customer.subscription.created':
                    case 'customer.subscription.updated': 
                    case 'customer.subscription.deleted':

                    const subscription = event.data.object as Stripe.Subscription
                    await saveSubscription(
                        subscription.id ,
                        subscription.customer.toString(), 
                       // type === 'customer.subscription.created' 
                       false
                       )
                       
                    break;

                    case  'checkout.session.completed':
                        //something
                        const checkoutSession = event.data.object as Stripe.Checkout.Session

                        await saveSubscription(
                         checkoutSession.subscription.toString(),
                         checkoutSession.customer.toString(), 
                         true)
                        break;
                
                    default:
                        throw new Error("Unhandled event");
                }
            }
        } catch (error) {
            return res.json({
                error: error
            })
        }

        res.status(200).json({
            received:true
        })
    }else{
        res.setHeader('Allow','POST')
        res.status(405).end('Method not allowerd, use POST method')
    }
}