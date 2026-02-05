const urlRegex = /^https?:\/\/(www\.)?[\w\-\.@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-\.@:%_\+.~#?&\\\/\/\/=]*)$/m

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

async function checkUrl(url: string, timeLimit?: number): Promise<boolean> {
    if (!urlRegex.test(url)) throw new Error(`Wrong URL given: ${url}!`)
    if (!timeLimit) timeLimit = await calcExpiringTime()
    console.log(`Checking: ${url}. TimeLimit: ${timeLimit}`)

    const controller = new AbortController()
    const id = setTimeout(() => {
        controller.abort()
        console.log(`\tChecking ${url} Failed!`)
    }, timeLimit)

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
        })
        console.log(`\tResponce(${url}): `, response.ok)
        return response.ok
    } catch (err: any) {
        console.log(`\tChecking ${url} Failed!`)
        return false
    } finally {
        clearTimeout(id)
    }
}

async function checkYoutube(timeLimit?: number): Promise<boolean> {
    return checkUrl('https://youtube.com', timeLimit)
}
async function checkDiscord(timeLimit?: number): Promise<boolean> {
    return checkUrl('https://discord.com', timeLimit)
}
async function check7tv(timeLimit?: number): Promise<boolean> {
    return checkUrl('https://7tv.app', timeLimit)
}

/**
 * @example
 * true  - is ok
 * false - some checks failed
 * null  - all checks failed
 */
export default async function ConnectionChecker(): Promise<boolean | null> {
    const timeLimit = await calcExpiringTime()
    const status = await Promise.all([
        checkDiscord(timeLimit),
        checkYoutube(timeLimit),
        // check7tv(timeLimit)
    ])
    const passesCount = status.filter(el => el).length

    if (passesCount === status.length) return true
    if (passesCount > 0 && passesCount < status.length) return false
    return null
}
