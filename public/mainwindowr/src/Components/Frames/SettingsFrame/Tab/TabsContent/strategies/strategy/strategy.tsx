import styles from './strategy.module.scss'
import Edit from './edit.svg.tsx'

export interface StrategyProps {
    name: string
}
export default function Strategy({name}: StrategyProps) {
    return <div className={`container ${styles.strategy_block}`}>
        <div className={styles.name}>{name}</div>
        <div className={styles.btns}>
            <div className={styles.edit}>
                <Edit/>
            </div>
            <img src="" className={styles.edit}/>
        </div>
    </div>
}
