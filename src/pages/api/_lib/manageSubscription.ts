import { Match, query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(subscriptionId:string,
     customerId:string,
     createAction =false){

    
    //getting the user Ref through ID of stripe
    const userRef = await fauna.query(
        query.Select(
            "ref",
            query.Get(
                query.Match(
                    query.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    //getting all information of subscribe from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id:subscription.id,
        userId: userRef,
        status:subscription.status,
        price_id: subscription.items.data[0].price.id,
    }

    if(createAction){  
        //Create subscription      
        await fauna.query(
            query.Create(
                query.Collection('subscription'),
                {
                    data:subscriptionData
                }
            )
        )
    }else{
        await fauna.query(
            query.Replace(
                query.Select(
                    "ref",
                    query.Get(
                        query.Match(
                            query.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                {data:subscriptionData}
            )
        )
    }
}

