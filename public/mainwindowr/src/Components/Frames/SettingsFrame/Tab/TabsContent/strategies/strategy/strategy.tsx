import styles from './strategy.module.scss'
import Edit from './edit.svg.tsx'
import type { IStrategy } from '../../../../../../../../../../modules/Core/Strategy.ts'
import Legacy from '../legacy/legacy.tsx'
import Play from './play.svg.tsx'
import { useContext } from 'react'
import ZapretContext from '../../../../../../../Contexts/Zapret/ZapretProvider.tsx'
import Remove from './remove.svg.tsx'
import { Tooltip } from 'react-tooltip'
<Tooltip></Tooltip>
export interface StrategyProps {
    strategy: IStrategy
}
export default function Strategy(props: StrategyProps) {
    const { strategy, installStrategy, settings } = useContext(ZapretContext)
    const isCurrent = strategy?.ino === props.strategy.ino && settings.status
    return <div className={`container ${styles.strategy_block} ${isCurrent && styles.active}`}>
        <div className={styles.name}>{props.strategy.fullName}</div>
        {props.strategy.isLegacy && <Legacy/>}
        <div className={styles.btns}>
            <div className={styles.btn} onClick={() => {
                if (isCurrent) {
                    installStrategy(null)
                } else {
                    installStrategy(props.strategy.ino)
                }
            }}>
                { isCurrent ? <Remove/> : <Play/> }
            </div>
            <div className={styles.btn}>
                <Edit/>
            </div>
        </div>
    </div>
}