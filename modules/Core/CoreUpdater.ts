import { app } from "electron"
import path, { sep } from 'path'
import fs, { rmdirSync, rmSync } from 'fs'
import axios from "axios"
import {createExtractorFromData, createExtractorFromFile} from 'node-unrar-js'
import ansiStyles from "ansi-styles"

import type { components } from "@octokit/openapi-types"
type GitHubRelease = components["schemas"]["release"]
type GitHubAsset = components["schemas"]["release-asset"]

import { checkUrl, type HTTPSString } from "./ConnectionCheker/сonnectionChecker.ts"
import { settings } from "./Settings.ts"
import Core, { headerPAT } from "./Core.ts"
import { coreDir } from './paths.ts'
import { colorizeFirst as cF, greatSuccess as gS } from "../decor/decorator.ts"
const cF_blue = (str: string) => cF(str, "#3b7be3")
export interface updateStrategiesResult {
    ok: boolean
    text?: string
}
let key = 0
export async function updateStrategy(repo: HTTPSString, filesFilter: RegExp, downloadBinaries: boolean = false): Promise<updateStrategiesResult> {
    console.log(cF_blue('> Checking github API',))
    if (!(await checkUrl('https://api.github.com', 2, 5_000))) return {ok: false, text: 'Нет соединения с https://api.github.com'}
    console.log(gS('SUCCESS'))
    const tempRarPath = path.resolve(app.getPath('temp'), `guboril${key}.rar`)

    const tempDir = path.resolve(app.getPath('temp'), `guboril${key}`)
    console.log(cF_blue('> Trying to remove old temporary data'))
    try {
        if (fs.existsSync(tempRarPath)) fs.rmSync(tempRarPath, {force: true})
        if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir, {recursive: true})
        console.log(gS('SUCCESS'))
    } catch (e: any) {
        console.error(e.stack)
        clearTemp()
        return {ok: false, text: 'Произошла ошибка при очистке старого кэша загрузок, попробуйте закрыть папку temp или перезагрузить ПК.'}
    }
    fs.mkdirSync(tempDir)
    console.log(cF_blue('> Searching for latest release'))
    try {
        const latestRelease = await axios.get<GitHubRelease>(repo + '/releases/latest', {
            headers: headerPAT,
            timeout: 3_000
        })
        var rarAsset = latestRelease.data.assets.find((asset) => asset.name.endsWith('.rar'))
        if (!rarAsset) return {ok: false, text: 'Не найдено .rar архива в последнем релизе. Попробуйте позднее или обновите Guboril.'}

    } catch (error) {
        console.error(error)
        clearTemp()
        return {ok: false, text: 'Произошла ошибка при поиске новой версии, возможно, источник сейчас недоступен, проверьте ваше интернет соединение или попробуйте ещё раз.'}
    }
    // Writing files to local temp archive
    console.log(cF_blue('> Downloading new files from repo.'))
    try {
        const {promise, resolve, reject} = Promise.withResolvers<void>()

        const writer = fs.createWriteStream(tempRarPath, {encoding: 'binary'})
        const stream = await axios(rarAsset.browser_download_url, {
            responseType: 'stream',
        })
        let count = 0
        stream.data.on('data', ((chunk: Buffer) => {
            count += chunk.length
            console.log(`Downloaded ${(count * 100 / rarAsset!.size).toFixed(1)} %`)
        }))
        stream.data.pipe(writer)
        
        // awaiting file has been fully downloaded
        stream.data.on('error', reject)
        const timeout = setTimeout(() => { reject() }, 60_000)
        writer.on('finish', () => {
            console.log(gS('SUCCESS'))
            timeout.close()
            resolve()
        })
        await promise
    } catch (e: any) {
        console.error(e.stack)
        clearTemp()
        return {ok: false, text: 'Произошла ошибка при скачивании архива, проверьте ваше интернет соединение или попробуйте ещё раз.'}
    } 

    // Unrar
    console.group(cF_blue('> Unpacking archive and save in temp folder'))
    try {
        const extractor = await createExtractorFromData({ data: fs.readFileSync(tempRarPath) as unknown as ArrayBuffer })
        const extracted = extractor.extract()
        for (const file of extracted.files) {
            const shortFileName = file.fileHeader.name.split('/').at(-1) as string

            // Writing .bat files
                // Last element of an array is the name of the strategy. Then test it through the given regexp
            if (filesFilter.test(shortFileName.trim())) { 
                console.log(cF(`◪ Writing file "${shortFileName}" to ${path.resolve(tempDir, shortFileName)}`, '#42f578'))
                fs.writeFileSync(path.resolve(tempDir, shortFileName), file.extraction as any)
            } else {
                if (!(downloadBinaries && file.fileHeader.name.includes('/bin/'))) console.log(cF(`✕ Skipping file "${shortFileName}"`, "#e33b3b"))
            }

            // Writing binaries files
            if (shortFileName.toLowerCase().includes('cygwin') || shortFileName.toLowerCase().includes('windivert')) {
                console.log(cF(`✕ Skipping "${shortFileName}"`, "#e33b3b"))
                continue
            }
            if (downloadBinaries && file.fileHeader.name.includes('/bin/')) {
                // Making bin path, if it doesn't exist yet.
                console.log(cF(`◆ Writing BIN file "${shortFileName}" to ${path.resolve(tempDir, shortFileName)}`, "#29a0e6"))
                if (!fs.existsSync(path.resolve(tempDir, 'bin'))) {
                    fs.mkdirSync(path.resolve(tempDir, 'bin'), { recursive: true })
                }
                // Writing bin file
                fs.writeFileSync(path.resolve(tempDir, 'bin', shortFileName), file.extraction as any)
            }
        }
        console.groupEnd()
    } catch (e: any) {
        console.groupEnd()
        console.error(e.stack)
        clearTemp()
        return {ok: false, text: 'Произошла ошибка при разархивировании файла, попробуйте закрыть папку temp или перезагрузить ПК.'}
    }

    Core.setStrategy(null)
    // Replacing old files with new
    console.log(cF_blue('> Replacing old files with new'))
    try {
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
    } catch (e: any) {
        console.error(e.stack)
        clearTemp()
        return {ok: false, text: 'Произошла ошибка при замене файлов в ядре, попробуйте отключить сервис вручную или закрыть папку Guboril'}
    }
    clearTemp()
    return {ok: true, text: 'Стратегии обновлены'}
    function clearTemp() {
        rmSync(tempDir, {recursive: true, force: true})
        rmSync(tempRarPath, {recursive: true, force: true})
    }
}
export default async function updateStrategies(): Promise<updateStrategiesResult[]> {
    return await Promise.all([
        updateStrategy('https://api.github.com/repos/Flowseal/zapret-discord-youtube', /^general(.*)\.bat$/, true)
    ])
}