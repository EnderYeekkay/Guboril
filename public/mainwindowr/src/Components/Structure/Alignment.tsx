import styles from "./Alignment.module.css"

export function Column({children}: {children: React.ReactNode}){
    return <div className={styles.column}>
        {children}
    </div>
}

export function Row({children}: {children: React.ReactNode}){
    return <div className={styles.row}>
        {children}
    </div>
}