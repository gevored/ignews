import styles from './styles.module.scss'

import {SubscriptButton} from '../SubscriptionButton/index'

interface HomeProps {
  product:{
    priceId:string;
    amount:number;
  }
}

export function BodyMain({product} :HomeProps ){
    return(
    <main className = {styles.contentContainer}>
        <section className = {styles.hero}>
          <span>👏 Hey ,welcome </span>
          <h1>news about <span>React</span> world </h1>
          <p>
            Get acess to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscriptButton/>
        </section>
        <img src="/images/avatar.svg" alt="" />
      </main>
    )
}