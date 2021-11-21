import {api} from '../../services/api'
import { useSession , signIn} from 'next-auth/client'
import styles from './style.module.scss'
import { getStripeJs } from '../../services/stripe-js'

//places where we can use the secret keys 

//SSR getServerSideProps
//SSG getStaticProps
//APIs Routes

export function SubscriptButton(){
    const [session] = useSession()

async function  handleSubscribe(){
        if(!session){
            signIn('github')
            return
        }

        try {
            const response = await api.post('/subscribe')
            const {sessionId} = response.data  
            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({sessionId})

        } catch (error) {
            alert(error.message)
        }
    }

    return(
        <button
            type ="button"
            className = {styles.subscribeButton}
            onClick = {handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}