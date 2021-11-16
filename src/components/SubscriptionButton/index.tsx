import styles from './style.module.scss'

export function SubscriptButton(){
    return(
        <button
            type ="button"
            className = {styles.subscribeButton}
        >
            Subscribe Now
        </button>
    )
}