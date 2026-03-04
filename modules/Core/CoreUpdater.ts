import { app } from "electron"
import path from 'path'
import fs from 'fs'
import axios from "axios"
import {createExtractorFromData, createExtractorFromFile} from 'node-unrar-js'
import { checkUrl, type HTTPSString } from "./ConnectionChecker.ts"
import { settings } from "./Settings.ts"
import ansiStyles from "ansi-styles"
import Core, { headerPAT } from "./Core.ts"
import { coreDir } from './paths.ts'
interface updateStrategiesResult {
    ok: boolean
    text?: string
}
let key = 0
export async function updateStrategies(repo: HTTPSString, filesFilter: RegExp): Promise<updateStrategiesResult> {
    // if (!(await checkUrl('https://api.github.com', 5_000))) return {ok: false, text: 'Нет соединения с https://api.github.com'}

    const tempRarPath = path.resolve(app.getPath('temp'), `guboril${key}.rar`)

    const tempDir = path.resolve(app.getPath('temp'), `guboril${key}`)
    try {
        if (fs.existsSync(tempRarPath)) fs.rmSync(tempRarPath, {force: true})
        if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir, {recursive: true})
    } catch (e) {
        console.error(e.stack)
        return {ok: false, text: 'Произошла при очистке старого кэша загрузок, попробуйте закрыть папку temp или перезагрузить ПК.'}
    }
    fs.mkdirSync(tempDir)

    const latestRelease = await axios.get(repo + '/releases/latest', {
        headers: headerPAT
    })
    const rarAsset = latestRelease.data.assets.find(asset => asset.name.endsWith('.rar'))
    if (!rarAsset) return {ok: false, text: 'Не найдено .rar архива в последнем релизе. Попробуйте позднее или обновите Guboril.'}

    // Writing files to local temp archive
    try {
        const {promise, resolve, reject} = Promise.withResolvers<void>()

        const writer = fs.createWriteStream(tempRarPath, {encoding: 'binary'})
        const stream = await axios(rarAsset.browser_download_url, {
            responseType: 'stream',
            headers: headerPAT
        })
        stream.data.on('data', ((chunk: Buffer) => {
        }))
        stream.data.pipe(writer)
        
        // awaiting file has been fully downloaded
        stream.data.on('error', reject)
        const timeout = setTimeout(() => { reject() }, 60_000)
        writer.on('finish', () => {
            timeout.close()
            resolve()
        })
        await promise
    } catch (e) {
        console.error(e.stack)
        return {ok: false, text: 'Произошла ошибка при скачивании архива, проверьте ваше интернет соединение или попробуйте ещё раз.'}
    }

    // Unrar
    try {
        const extractor = await createExtractorFromData({data: fs.readFileSync(tempRarPath) as unknown as ArrayBuffer})
        const extracted = extractor.extract()
        for (const file of extracted.files) {
            if (filesFilter.test(file.fileHeader.name)) {
                fs.writeFileSync(path.resolve(tempDir, file.fileHeader.name), file.extraction)
            }
        }
    } catch (e) {
        console.error(e.stack)
        return {ok: false, text: 'Произошла ошибка при разархивировании файла, попробуйте закрыть папку temp или перезагрузить ПК.'}
    }

    console.warn('a')
    // Replacing old files with new
    try {
        Core.setStrategy(null)
        console.warn('a')
        const strategyFiles = fs.readdirSync(tempDir)
        console.log('asd', strategyFiles)
        for (const strategyFile of strategyFiles) {
            console.log(strategyFile)
            fs.cpSync(
                path.join(tempDir, strategyFile),
                path.join(coreDir, strategyFile),
                { recursive: true, force: true }
            )
        }
    } catch (e) {
        console.error(e.stack)
    }
    return {ok: true, text: 'Стратегии обновлены'}
}
