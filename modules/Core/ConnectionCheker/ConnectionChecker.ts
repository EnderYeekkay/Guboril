import isReachable from "is-reachable"

import type { BrowserWindow } from "electron"
import type { domainString } from "./urlsToCheck.ts"
import urlsToCheck, { URLsToCheck } from "./urlsToCheck.ts"
import EasyTable from "easy-table"
import {action, colorizeFirst as cF, data} from '../../decor/decorator.ts'
const debug = false
const l = console.log

export type HTTPSString = `https://${domainString}`

export type ConnectionStatus = {
    url: HTTPSString
    status: boolean
    attempts: number
}

export interface CheckUrlOptions {
    attempts?: number
    timeout?: number
    signal?: AbortSignal
}
export default class ConnectionChecker {
    private constructor() {}

    public static status: ConnectionStatus[]
    public static isChecking: boolean
    public static maxAttempts: number
    public static timeout: number

    private static win: BrowserWindow

    private static checkId = 0n
    private static abortController: AbortController = new AbortController()

    public static init(mainWindow: BrowserWindow, maxAttempts = 3, timeout = 3000) {
        this.maxAttempts = maxAttempts
        this.timeout = timeout
        this.isChecking = false
        this.win = mainWindow
    }

    /**
     * Calculates the maximum acceptable request timeout.
     * @returns Time in the range of **1000**-**8000**ms
     */
    public static async calcExpiringTime(): Promise<number> {
        const start = performance.now();
        try {
            await isReachable('ya.ru:443', { signal: AbortSignal.timeout(5000)});
        } catch {
            return 5000;
        }
        const final = Math.round(performance.now() - start);
        return Math.min(Math.max(final * 5, 1000), 8000);
    }

    
    public static async checkUrl(url: HTTPSString, options: CheckUrlOptions = {}): Promise<ConnectionStatus> {
        const {
            attempts = this.maxAttempts,
            timeout = this.timeout,
            signal,
        } = options
        const signals: AbortSignal[] = [
            AbortSignal.timeout(timeout)
        ]
        signal && signals.push(signal)
        
        try {
            new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch {
            throw new Error(`Wrong URL given: ${url}!`);
        }

        if (debug) console.log(`Checking: ${url}. timeout: ${timeout}`);
        let reachable = false
        for (var i = 0; i < attempts;) {
            i++
            reachable = await isReachable(url, { 
                signal: AbortSignal.any(signals)
            })
            signals[0] = AbortSignal.timeout(timeout)
            if (reachable) break
        }
    
        if (debug && !reachable) console.log(`\tChecking ${url} Failed!`);
        return {
            url: url,
            status: reachable,
            attempts: i
        }    
    }
    
    public static async checkInternet(): Promise<boolean> {
        l('Check internet')
        console.time('Check internet')
        try {
            return !!(await Promise.all([
                this.checkUrl('https://ya.ru' as HTTPSString),
                this.checkUrl('https://mail.ru' as HTTPSString),
                this.checkUrl('https://vk.ru' as HTTPSString)
            ])).find(res => res.status)?.status
        } catch (e) {
            return false
        } finally {
            console.timeLog('Check internet')
            console.timeEnd('Check internet')
        }
    }

    public static async check(): Promise<void> {
        const start = performance.now()
        this.abortController.abort()
        this.abortController = new AbortController()
        
        let myCheckId = this.checkId + 1n
        this.checkId = myCheckId
        console.log(action('Initializing new Connection Checker instance with id: ' + myCheckId))

        const timeoutTime = await this.calcExpiringTime()
        console.log(data(`Instance timeout: ${timeoutTime}`))
        const timeout = setTimeout(() => {
            if (myCheckId === this.checkId) { this.abortController.abort() }
        }, timeoutTime)

        if (myCheckId !== this.checkId) {
            console.log(cF(`✕ Rejected check instance with id "${myCheckId}"`, "#e33b3b"))
            return
        }

        console.log(action('Checking urls...'))
        const checkResult = await Promise.all(
            URLsToCheck.all.map(async (url) => await this.checkUrl(`https://${url}`, { signal: this.abortController.signal }))
        )
        clearTimeout(timeout)
        if (myCheckId !== this.checkId) {
            console.log(cF(`✕ Rejected check instance with id "${myCheckId}"`, "#e33b3b"))
            return
        }
        this.status = checkResult
        const end = performance.now()
        console.log(cF(`◆ Checker Instance ${this.checkId} result:`, "#29a0e6"))
        console.log(`Passed (${checkResult.filter(el => el.status).length} / ${checkResult.length}), time: ${Math.round(end - start)}ms.`)
        console.table(this.status)
        console.log()
        this.win.webContents.send('ConnectionChecker:check', this.status)
    }
}
