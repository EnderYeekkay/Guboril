import { spawn, spawnSync } from 'node:child_process'
import { type SpawnSyncOptionsWithStringEncoding } from 'node:child_process'
import * as paths from './paths.ts'
import iconv from 'iconv-lite'
import { error, log } from 'node:console'
import type { GameFilterOptions, parsedStrategy } from './Strategies/strategyParser.ts'
import { type SpecialString } from './Core.ts'

const debug = false
/**
 * Коды возврата sc create (System Error Codes)
 * 0 - Успех
 * 5 - Доступ запрещен
 * 123 - Неверное имя
 * 1053 - Таймаут
 * 1059 - Циклическая зависимость
 * 1060 - Служба не найдена
 * 1072 - Помечена на удаление
 * 1073 - Уже существует
 * 1075 - Зависимость не существует
 * 1639 - Ошибка параметров (пробел после '=')
 */
type ScCode = 0 | 5 | 123 | 1053 | 1059 | 1060 | 1072 | 1073 | 1075 | 1639;
export function sleepSync(time: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, time);
}

export const options: Partial<SpawnSyncOptionsWithStringEncoding> = {
    shell: false,
    windowsHide: true,
    //@ts-ignore
    encoding: 'buffer'
}

export default class SCController { 
    private constructor() {}
    static start(params: SpecialString<parsedStrategy>, strategyTitle: string, gameFilterTitle: GameFilterOptions): boolean {
        SCController.delete()
        const exePath = `${paths.binPath}\\winws.exe`
        const binPathValue = `"${exePath}"  ${params}`;
        const createRes = spawnSync('sc', [
            'create', 'GuborilCore', 
            `binPath=${binPathValue}`, 
            'start=', 'auto', 
            'DisplayName=', 'GuborilCore'
        ], options);
        spawnSync('sc', [
            'description', 
            'GuborilCore', 
            'Служба фильтрации трафика Winws.exe\r\n' +
              'Параметры:\r\n' +
              `strategyTitle:${strategyTitle}:\r\n` +
              `gameFilterLegacy:${gameFilterTitle.legacy}:\r\n` +
              `gameFilterTCP:${gameFilterTitle.TCP}:\r\n` +
              `gameFilterUDP:${gameFilterTitle.UDP}:\r\n`,
        ], options);

        const startRes = spawnSync('sc', ['start', 'GuborilCore'], options);
        const stdout = iconv.decode(startRes.stdout as Buffer<ArrayBufferLike>, 'cp866')
        const stderr = iconv.decode(startRes.stderr as Buffer<ArrayBufferLike>, 'cp866')

        if (debug) console.log('stdout:', stdout)
        if (debug) console.log('stderr:', stderr)
        if (debug) console.log('status:', startRes.status)

        return startRes.status === 0
    }

    static checkService(): boolean {
        const res = spawnSync('sc', ['query', 'GuborilCore'])
        sendNotify(res.status as ScCode)
        return res.status === 0
    }
    static stop(): boolean {
        // 1. Отправляем команду на остановку
        const res = spawnSync('sc', ['stop', 'GuborilCore'], options);
        
        // Код 1062 означает, что служба и так не была запущена (успех для нас)
        if (res.status === 1062) return true;
        
        // Если ошибка отличная от 0 (и не 1062), значит что-то пошло не так
        if (res.status !== 0) {
            sendNotify(res.status as ScCode);
            return false;
        }

        // 2. Ждем реальной остановки (Polling)
        // sc stop возвращает управление мгновенно, но процесс может завершаться долго
        let attempts = 0;
        while (attempts < 30) { // Ждем максимум 3 секунды (15 * 200мс)
            const query = spawnSync('sc', ['query', 'GuborilCore'], options);
            const output = query.stdout?.toString() || '';
            // Если служба перешла в статус STOPPED
            if (output.includes('STOPPED')) {
                return true;
            }

            // Если службы вообще нет (кто-то удалил её параллельно)
            if (query.status === 1060) return true;

            // Небольшая пауза перед следующей проверкой
            sleepSync(100)
            attempts++;
        }

        console.error('Превышено время ожидания остановки службы');
        return false;
    }
    static delete(): boolean {
        SCController.stop()
        const res = spawnSync('sc', ['delete', 'GuborilCore'])
        sendNotify(res.status as ScCode)
          if (res.status !== 0 && res.status !== 1060) { // Если не успех и служба не отсутствовала изначально
            sendNotify(res.status as ScCode);
            return false;
        }

        // 3. Цикл ожидания физического удаления (polling)
        let attempts = 0;
        while (attempts < 20) {
            const check = spawnSync('sc', ['query', 'GuborilCore'], options);
            if (check.status === 1060) return true; // Служба окончательно исчезла
            
            // Маленькая пауза между проверками (синхронно для spawnSync)
            sleepSync(100)
            attempts++;
        }
        return res.status === 0
    }
    static enableTimestampsTCP() {
        const check = spawnSync('netsh', ['interface', 'tcp', 'show', 'global'], options);
        const output = check.stdout?.toString() || '';
        
        if (output.toLowerCase().includes('timestamps') && output.toLowerCase().includes('enabled')) {
            return null;
        }
        const result = spawnSync('netsh', [
            'interface', 
            'tcp', 
            'set', 
            'global', 
            'timestamps=enabled'
        ], options);

        return result.status === 0;
    }
}

export interface ScResult {
  error: string;
  solution: string;
}

function sendNotify(code: ScCode) {
    let scResult = getScErrorInfo(code)
}
function getScErrorInfo(code: ScCode): ScResult {
  const exitCode = code as ScCode;

  switch (exitCode) {
    case 0:
      return {
        error: "Успех!",
        solution: "Операция выполнена успешно!"
      };
    case 5:
      return {
        error: "Access Denied (Отказано в доступе)",
        solution: "Запустите терминал от имени Администратора."
      };
    case 123:
      return {
        error: "Invalid Name (Неверное имя)",
        solution: "Проверьте имя службы на наличие запрещенных символов."
      };
    case 1053:
      return {
        error: "Service Request Timeout",
        solution: "Проверьте binPath. Файл должен поддерживать интерфейс службы (ServiceMain)."
      };
    case 1059:
      return {
        error: "Circular Dependency (Циклическая зависимость)",
        solution: "Служба не может зависеть от самой себя или создавать замкнутый круг зависимостей."
      };
    case 1060:
      return {
        error: "Service Does Not Exist",
        solution: "Указанная в параметре 'depend=' служба не установлена в системе."
      };
    case 1072:
      return {
        error: "Marked for Delete",
        solution: "Закройте окно 'Службы' (services.msc). Если не помогло — перезагрузитесь."
      };
    case 1073:
      return {
        error: "Service Already Exists",
        solution: "Служба с таким именем уже есть. Удалите её командой 'sc delete [имя]'."
      };
    case 1075:
      return {
        error: "Dependency Service Deleted",
        solution: "Зависимая служба не существует или помечена на удаление."
      };
    case 1639:
      return {
        error: "Invalid Parameter",
        solution: "Добавьте пробел ПЕРЕД значением. Правильно: binPath= \"путь\", а не binPath=\"путь\"."
      };
  }
}

SCController.enableTimestampsTCP()
