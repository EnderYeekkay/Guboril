import styles from './header.module.scss'
export default function Collapse() {
    return <div className={styles.header_btn} id={styles.minimize} onClick={mw.minimize}>
        <img className={styles.header_btn_ico} src="../collapse.png" alt=""/>
    </div>
}