import styles from './styles.module.scss'
import {SignInButton} from '../SignInButton/index'

export function Header(){
    return(
        <header className = {styles.headerContainer}>
            <div className = {styles.hederContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <a className = {styles.active}>Home</a>
                    <a>Posts</a>
                </nav>
                <SignInButton/>
            </div>
        </header>
    )
}