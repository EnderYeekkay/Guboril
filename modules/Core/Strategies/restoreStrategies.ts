import { resolve as pr } from 'path'
import fs, { copyFileSync } from 'fs'

import { coreDir } from '../paths.ts'
import StrategyManager from './StrategyManager.ts'
import { bold, writingSquare } from '../../decor/decorator.ts'

const backupPath = pr(coreDir, './backup/strategies')

export default function restoreStrategies(): 0 | 1 | 2 {
    try {
        const backupDir = fs.readdirSync(backupPath)
        const res = backupDir.map(strategyName => {
            try {
                console.log(writingSquare(`Restoring strategy: ${bold(strategyName)}`))
                copyFileSync(pr(backupPath, strategyName), pr(coreDir, strategyName))
                return true
            } catch (e) {
                console.error(e)
                return false
            }
        })

        if (res.includes(false)) {
            console.warn('Some strategies couldn\'t be restored!')
            return 1
        }
        console.log('Strategies have been succesfully restored!')
        return 0
    } catch (e) {
        console.error(e)
        return 2
    }
}
