import { execSync } from 'child_process'
import { app } from 'electron'
import { rmdirSync, rmSync } from 'fs'
import type { RmOptions } from 'fs'
import path from 'path'
export default function execute() {
    const roamingPath = app.getPath('appData')
    const pathToCache = path.resolve(roamingPath, 'discord')
    const rmOptions: RmOptions = { recursive: true, force: true }
    
    try {
        execSync('tasklist /FI "IMAGENAME eq Discord.exe" | findstr /I "Discord.exe"', { stdio: 'ignore' })
        try {
            console.log(execSync('taskkill /F /IM discord.exe /T', { stdio: 'ignore' }))
        } catch(e) {
            console.warn('Failed to kill discord.')
        }
    } catch (e) {
        console.log('Discord is not launched.')
    }

    try {
        rmSync(path.resolve(pathToCache, 'Cache'), rmOptions)
        rmSync(path.resolve(pathToCache, 'Code Cache'), rmOptions)
        rmSync(path.resolve(pathToCache, 'GPUCache'), rmOptions)
    } catch (e) {
        return false
    }
    return true
}
