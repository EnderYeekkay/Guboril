import styles from './header.module.scss'
export default function Close() {
    return <div className={styles.header_btn} id={styles.close} onClick={mw.closeWindow}>
        <img className={styles.header_btn_ico} src="../close.png" alt=""/>
    </div>
}
   