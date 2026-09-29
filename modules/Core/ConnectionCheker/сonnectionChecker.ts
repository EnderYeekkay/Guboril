import EasyTable from 'easy-table'
import ansi from "ansi-styles"
import isReachable from 'is-reachable'
const color = ansi.color
const urlRegex = /^https?:\/\/(www\.)?[\w\-\.@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-\.@:%_\+.~#?&\\\/\/\/=]*)$/m
import urlsToCheck from "./urlsToCheck.ts"
export type HTTPSString = `https://${string}.${string}`


const debug = false

async function calcExpiringTime(): Promise<number> {
    const start = performance.now();
    try {
        // Проверяем только порт 443 (https), чтобы было максимально быстро
        await isReachable('ya.ru:443', { signal: AbortSignal.timeout(5000)});
    } catch {
        return 5000;
    }
    const final = Math.round(performance.now() - start);
    return Math.max(final * 5, 1000);
}


export async function checkInternet(): Promise<boolean> {
    if (await checkUrl('https://ya.ru', 2, 3_000)) return true
    if (await checkUrl('https://mail.ru', 2, 3_000)) return true
    if (await checkUrl('https://vk.ru', 2, 3_000)) return true
    return false
}

export async function checkUrl(url: HTTPSString, attemps: number = 2, timeout?: number,): Promise<[boolean, number]> {
   // Встроенная в Node.js / браузеры валидация вместо ненадёжного regex
    try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
        throw new Error(`Wrong URL given: ${url}!`);
    }

    if (!timeout) timeout = await calcExpiringTime();
    if (debug) console.log(`Checking: ${url}. timeout: ${timeout}`);
    let reachable: boolean = false
    let i = 0
    for ('Моржи'; i < attemps; i++) {
        reachable = await isReachable(url, { signal: AbortSignal.timeout(timeout) })
        if (reachable) break
    }

    if (debug && !reachable) console.log(`\tChecking ${url} Failed!`);
    return [reachable, i];

}

export type ConnectionCheckerResult = {
    passes: number
    successfulPasses: number
} | false
/**
 * @example
 * true  - is ok
 * false - some checks failed
 * null  - all checks failed
 */
export default async function ConnectionChecker(attempts: number = 2): Promise<ConnectionCheckerResult> {
    const begin = Date.now()
    if (!(await checkInternet())) return false
    const timeout = await calcExpiringTime()
    const checkResult = await Promise.all(
        urlsToCheck.map(async (url) => {
            const [tempStatus, tempAttempts] = await checkUrl(`https://${url}`, attempts, timeout)
            return {
                url: url,
                status: tempStatus,
                attempts: tempAttempts
            }
        })
    )
    console.log(EasyTable.print(checkResult.map((el) => {
        return {
            ...el,
            status: el.status ? 'OK' : 'FAILED',
            attempts: `${el.attempts} / ${attempts}`
        }
    }
    )))
    const res = {
        passes: urlsToCheck.length,
        successfulPasses: checkResult.filter(el => el.status).length
    }
    const end = Date.now()
    console.log(
        'Connection check result: succesful passes (' +
        color.green.open +
        res.successfulPasses + 
        color.green.close +
        ' / ' +
        color.cyan.open +
        res.passes +
        color.cyan.close +
        '), time: ' +
        color.yellow.open +
        (end - begin) +
        color.yellow.close +
        'ms.'
    )
    return res
}
