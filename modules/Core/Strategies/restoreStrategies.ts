import { resolve as pr } from 'path'
import fsAsync from 'fs/promises'
import fs from 'fs'

import { coreDir } from '../paths.ts'
import StrategyManager from './StrategyManager.ts'

const backupPath = pr(coreDir, './backup/strategies')

export default async function restoreStrategies(): Promise<0 | 1 | 2> {
    try {
        const backupDir = await fsAsync.readdir(backupPath)
        const res = await Promise.all(StrategyManager.All.map(async strategy => {
            if (!backupDir.includes(strategy.fullName)) return
            const newCode = await fsAsync.readFile(pr(backupPath, strategy.fullName))
            try {
                await fsAsync.writeFile(pr(coreDir, strategy.fullName), newCode)
                return true
            } catch (e) {
                console.error(e)
                return false
            }
        }))

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
