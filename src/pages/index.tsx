import {GetStaticProps} from 'next'
import Head from 'next/head' 
import { BodyMain } from '../components/Home'
import { stripe } from '../services/stripe'


interface HomeProps {
  product:{
    priceId:string;
    amount:number;
  }
}

export default function Home({product} : HomeProps) {
  console.log(product)
  return (
    <>
      <Head>
        <title> Home | ig.news</title>
      </Head>

      <BodyMain  product= {product}/>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Jw4VtCgrVsQ6l6lvQ1ecNaQ')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24

  return {
    revalidate: ONE_DAY_IN_SECONDS,
    props: {
      product
    }
  }
}

