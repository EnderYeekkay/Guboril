import iconv from 'iconv-lite'
import { spawn, spawnSync, type SpawnSyncOptions, type SpawnSyncReturns } from 'node:child_process'
import { type SpawnSyncOptionsWithStringEncoding } from 'node:child_process'
import { error, log } from 'node:console'

import * as paths from './paths.ts'

import type { GameFilterOptions, parsedStrategy } from './Strategies/strategyParser.ts'
import { type SpecialString } from './Core.ts'
import { ScCode } from './winServiceCodes.ts'

const debug = false

export function sleepSync(time: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, time)
}

export const options: Partial<SpawnSyncOptionsWithStringEncoding> = {
    shell: false,
    windowsHide: true,
    //@ts-ignore
    encoding: 'buffer'
}
export default class SCController { 
    private constructor() {}
    public static killall(): boolean {
		const resGC = spawnSync('sc', ['delete', 'GuborilCore'], options)
		const resWD = spawnSync('sc', ['delete', 'WinDivert'], options)
		const resZ = spawnSync('sc', ['delete', 'Zapret'], options)

		let attempts = 0
		while (attempts < 30) {
			const queryGC = spawnSync('sc', ['query', 'GuborilCore'], options)
			const queryWD = spawnSync('sc', ['query', 'WinDivert'], options)
			const queryZ = spawnSync('sc', ['query', 'Zapret'], options)

			if (queryGC.status === 1060 && queryWD.status === 1060 && queryZ.status === 1060) return true
			
			sleepSync(100)
			attempts++
      	}
		return false
    }
    static start(params: SpecialString<parsedStrategy>, strategyTitle: string, gameFilterTitle: GameFilterOptions): boolean {
        SCController.delete()
        const exePath = `${paths.binPath}\\winws.exe`
        const binPathValue = `"${exePath}"  ${params}`
        const createRes = spawnSync('sc', [
            'create', 'GuborilCore', 
            `binPath=${binPathValue}`, 
            'start=', 'auto', 
            'DisplayName=', 'GuborilCore'
        ], options)
        spawnSync('sc', [
            'description', 
            'GuborilCore', 
            'Служба фильтрации трафика Winws.exe\r\n' +
				'Параметры:\r\n' +
				`strategyTitle:${strategyTitle}:\r\n` +
				`gameFilterLegacy:${gameFilterTitle.legacy}:\r\n` +
				`gameFilterTCP:${gameFilterTitle.TCP}:\r\n` +
				`gameFilterUDP:${gameFilterTitle.UDP}:\r\n`,
        ], options)

        const startRes = spawnSync('sc', ['start', 'GuborilCore'], options)
        const stdout = iconv.decode(startRes.stdout as Buffer<ArrayBufferLike>, 'cp866')
        const stderr = iconv.decode(startRes.stderr as Buffer<ArrayBufferLike>, 'cp866')

        if (debug) console.log('stdout:', stdout)
        if (debug) console.log('stderr:', stderr)
        if (debug) console.log('status:', startRes.status)

        return startRes.status === 0
    }

    static checkService(): boolean {
        const res = spawnSync('sc', ['query', 'GuborilCore'])
        return res.status === 0
    }
    static stop(): boolean {
        return spawnAndCheck({
                command: 'sc',
                args: ['stop', 'GuborilCore']
            }, 
            [ScCode.Success, ScCode.MarkedForDeletion, ScCode.NotFound, ScCode.NotActive], {
                command: 'sc',
                args: ['query', 'GuborilCore']
            },
            [ScCode.NotFound, ScCode.InvalidName, ScCode.Success]
        )
    }
    static delete(): boolean {
        SCController.stop()
        return spawnAndCheck({
                command: 'sc',
                args: ['delete', 'GuborilCore']
            }, 
            [ScCode.Success, ScCode.MarkedForDeletion, ScCode.NotFound], {
                command: 'sc',
                args: ['query', 'GuborilCore']
            },
            [ScCode.NotFound, ScCode.InvalidName]
        )
    }
    static enableTimestampsTCP() {
        const check = spawnSync('netsh', ['interface', 'tcp', 'show', 'global'], options)
        const output = check.stdout?.toString() || ''
        
        if (output.toLowerCase().includes('timestamps') && output.toLowerCase().includes('enabled')) {
			console.log('TCP Timestamps already enabled!')
            return null
        }
        const result = spawnSync('netsh', [
            'interface', 
            'tcp', 
            'set', 
            'global', 
            'timestamps=enabled'
        ], options)
		console.log('TCP Timestamps turned on.')
        return result.status === 0
    }
}

interface PwdCommandObject {
    command: string
    args: string[]
    options?: SpawnSyncOptions
}

function spawnAndCheck(
    action: PwdCommandObject,
    actionCodes: ScCode[],
    check: PwdCommandObject, 
    checkCodes: ScCode[],
    timeLimit: number = 3000
): boolean {
    action.options = {
        ...options,
        ...action.options
    }
    check.options = {
        ...options,
        ...check.options
    }

    const resAction = spawnSync(action.command, action.args, action.options)
    if (!actionCodes.includes(resAction.status as any)) {
        console.log(`${resAction.status} not found in ${actionCodes}`)
        sendNotify(resAction.status as any)
        throw new Error(`Action ${action.command} with args ${action.args} failed!\nError: ${resAction.stderr}`)
    }

    let resCheck: SpawnSyncReturns<string | NonSharedBuffer>
    let i = 0
    do {
        i += 100
        resCheck = spawnSync(check.command, check.args, check.options)
        if (checkCodes.includes(resCheck.status as any)) {
            console.log(resCheck.status, ' ', checkCodes, checkCodes.includes(resCheck.status as any))
            return true
        }
        sleepSync(100)
    } while (i >= timeLimit)
    sendNotify(resCheck.status as any)
    return false
}

export interface ScResult {
  error: string
  solution: string
}

function sendNotify(code: ScCode) {
    let scResult = getScErrorInfo(code)
}
function getScErrorInfo(code: ScCode): ScResult {
  const exitCode = code as ScCode

  switch (exitCode) {
    case 0:
      return {
        error: "Успех!",
        solution: "Операция выполнена успешно!"
      }
    case 5:
      return {
        error: "Access Denied (Отказано в доступе)",
        solution: "Запустите терминал от имени Администратора."
      }
    case 123:
      return {
        error: "Invalid Name (Неверное имя)",
        solution: "Проверьте имя службы на наличие запрещенных символов."
      }
    case 1053:
      return {
        error: "Service Request Timeout",
        solution: "Проверьте binPath. Файл должен поддерживать интерфейс службы (ServiceMain)."
      }
    case 1059:
      return {
        error: "Circular Dependency (Циклическая зависимость)",
        solution: "Служба не может зависеть от самой себя или создавать замкнутый круг зависимостей."
      }
    case 1060:
      return {
        error: "Service Does Not Exist",
        solution: "Указанная в параметре 'depend=' служба не установлена в системе."
      }
    case 1072:
      return {
        error: "Marked for Delete",
        solution: "Закройте окно 'Службы' (services.msc). Если не помогло — перезагрузитесь."
      }
    case 1073:
      return {
        error: "Service Already Exists",
        solution: "Служба с таким именем уже есть. Удалите её командой 'sc delete [имя]'."
      }
    case 1075:
      return {
        error: "Dependency Service Deleted",
        solution: "Зависимая служба не существует или помечена на удаление."
      }
    case 1639:
      return {
        error: "Invalid Parameter",
        solution: "Добавьте пробел ПЕРЕД значением. Правильно: binPath= \"путь\", а не binPath=\"путь\"."
      }
    default:
        throw new Error(`Неизвестный код ошибки службы: ${code}`)
  }
}

SCController.enableTimestampsTCP()
