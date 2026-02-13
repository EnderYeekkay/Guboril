const urlRegex = /^https?:\/\/(www\.)?[\w\-\.@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-\.@:%_\+.~#?&\\\/\/\/=]*)$/m
export type HTTPSString = `https://${string}.${string}`
export type domainString = `${string}.${string}`

const debug = false

async function calcExpiringTime(): Promise<number> {
    const start = performance.now()
    try {
        await fetch('https://ya.ru', { method: 'HEAD' })
    } catch (e) {
        return 5_000
    }
    const final = Math.round(performance.now() - start)
    return Math.max(final * 5, 1_000)
}


export async function checkInternet() {
    return await checkUrl('https://ya.ru', 3_000)
}

async function checkUrl(url: HTTPSString, timeLimit?: number): Promise<boolean> {
    if (!urlRegex.test(url)) throw new Error(`Wrong URL given: ${url}!`)
    if (!timeLimit) timeLimit = await calcExpiringTime()
    if (debug) console.log(`Checking: ${url}. TimeLimit: ${timeLimit}`)

    const controller = new AbortController()
    const id = setTimeout(() => {
        controller.abort()
        if (debug) console.log(`\tChecking ${url} Failed!`)
    }, timeLimit)

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
        })
        if (debug) console.log(`\tResponce(${url}): `, response.ok)
        return response.ok
    } catch (err: any) {
        if (debug) console.log(`\tChecking ${url} Failed!`)
        return false
    } finally {
        clearTimeout(id)
    }
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
export default async function ConnectionChecker(): Promise<ConnectionCheckerResult> {
    if (!(await checkInternet())) return false
    const timeLimit = await calcExpiringTime()
    const urlsToCheck = [
        'youtube.com',
        'discord.com',
        'instagram.com',
        'facebook.com'
    ] as domainString[]
    const status = await Promise.all(
        urlsToCheck.map((url) => checkUrl(`https://${url}`, timeLimit))
    )
    return {
        passes: urlsToCheck.length,
        successfulPasses: status.filter(el => el).length
    }
}
