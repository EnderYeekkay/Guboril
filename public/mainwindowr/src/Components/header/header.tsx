import Collapse from './collapse.tsx'
import Close from './close.tsx'
import { useEffect } from 'react'
import NotifiesListBtn from './notifiesListBtn.tsx'
import './header.module.scss'
import styles from './header.module.scss'
export default function Header() {
    return <header>
        <img id={styles.logo} src="../icon.ico"/>
        <div id={styles.maintext}>Губорыл {mw.version}</div>
        <div id={styles.header_btns}>
            <NotifiesListBtn/>
            <Collapse/>
            <Close/>
        </div>
    </header>
}
