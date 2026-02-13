import { execSync } from 'child_process'
import { app } from 'electron'
import { rmdirSync, rmSync } from 'fs'
import type { RmOptions } from 'fs'
import path from 'path'
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export default async function execute() {
    const roamingPath = app.getPath('appData')
    const pathToCache = path.resolve(roamingPath, 'discord')
    const rmOptions: RmOptions = { recursive: true, force: true }
    
    try {
        execSync('tasklist /FI "IMAGENAME eq Discord.exe" | findstr /I "Discord.exe"', { stdio: 'ignore' })
        try {
            console.log(execSync('taskkill /F /IM discord.exe /T', { stdio: 'ignore' }))
        } catch (e) {
            console.warn('Failed to kill discord.')
        }
        await sleep(2000)
    } catch (e) {
        console.log('Discord is not launched.')
    }

    try {
        rmSync(path.resolve(pathToCache, 'Cache'), rmOptions)
        rmSync(path.resolve(pathToCache, 'Code Cache'), rmOptions)
        rmSync(path.resolve(pathToCache, 'GPUCache'), rmOptions)
        console.log('Cache cleaned successfully!')
    } catch (e) {
        console.log('Failed to clean cache ', e.stack)
        return false
    }
    return true
}
