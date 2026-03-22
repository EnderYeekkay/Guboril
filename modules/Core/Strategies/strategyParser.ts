import { type SpecialString } from '../Core.ts'
import * as paths from'../paths.ts'
import { sep } from 'path'
const debug = false
function get_gf(v: boolean): string {
    const gf_value_enabled = '1024-65535'
    const gf_value_disabled = '12'
    return `${v ? gf_value_enabled : gf_value_disabled}`
}
export type GameFilterOptions = {
    TCP: boolean
    UDP: boolean
    legacy: boolean
}
export type parsedStrategy = string

export default function(str: string, game_filter: GameFilterOptions): SpecialString<parsedStrategy> {
    if (!str || game_filter === undefined) throw new Error(`Wrong parameters given: ${str}, ${game_filter}`)
    let lines = str.split(/\r?\n/)
    let entryIdx = -1

    // Поиск строки ...start "zapret: %~n0" /min "%BIN%winws.exe" --wf-tc...
    lines.find((val, idx) => {
        let res = val.includes('winws.exe') 
        if (res) entryIdx = idx
        return res
    })

    // Такой строки не найдено
    if (entryIdx < 1) throw new Error('No entry point has been detected in the strategy!')
    // Обрезаем массив lines
    lines.splice(0, entryIdx - 1)
    lines = lines.filter(val => val.length > 1)
    // Поиск первого параметра стратегии
    const entryFirstArgIdx = lines[0].indexOf('--')
    lines[0] = lines[0].substring(entryFirstArgIdx)
    if (debug) console.log(lines)
    // Фильтрация мусора
    lines = lines.map(val => val.trim())
    lines = lines.filter(val => val.match(/^--.*$/))

    // Подстановка значений и очистка от символа ^
    lines.forEach((val, i, arr) => {
        arr[i] = val
            .replace(/\^$/, '')
            .replaceAll('=', ' ')
            .replaceAll('%GameFilter%', get_gf(game_filter.legacy))
            .replaceAll('%GameFilterTCP%', get_gf(game_filter.TCP))
            .replaceAll('%GameFilterUDP%', get_gf(game_filter.UDP))
            .replaceAll('%LISTS%', paths.listsPath + sep)
            .replaceAll('%BIN%', paths.binPath + sep)
    })
    lines = lines.map(val => val.trim())
    let res = lines.join(' ')
    return res as SpecialString<parsedStrategy>
}
