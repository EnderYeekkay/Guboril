import styles from './strategy.module.scss'
import Edit from './edit.svg.tsx'
import type { IStrategy } from '../../../../../../../../../../modules/Core/Strategy.ts'
import Legacy from '../legacy/legacy.tsx'
import Play from './play.svg.tsx'
import { useContext } from 'react'
import ZapretContext from '../../../../../../../Contexts/Zapret/ZapretProvider.tsx'

export interface StrategyProps {
    strategy: IStrategy
}
export default function Strategy(props: StrategyProps) {
    const { strategy } = useContext(ZapretContext)
    return <div className={`container ${styles.strategy_block} ${strategy.ino === props.strategy.ino && styles.active}`}>
        <div className={styles.name}>{props.strategy.fullName}</div>
        {props.strategy.isLegacy && <Legacy/>}
        <div className={styles.btns}>
            <div className={styles.btn}>
                <Play/>
            </div>
            <div className={styles.btn}>
                <Edit/>
            </div>
        </div>
    </div>
}