import Readline from 'readline'
import { resolve as pr } from 'path'
import { type ChildProcessWithoutNullStreams, spawn } from 'child_process'
import EventEmitter from 'events'
import util from 'node:util'

import { scriptsPath } from './paths.ts'
import { bold, data } from '../decor/decorator.ts'

const debug = false

type SystemEventLevel = 'Critical' | 'Error' | 'Warning' | 'Information' | 'Verbose';

export interface ISystemEvent {
    time: Date
    id: number;
    level: SystemEventLevel,
    source: string
    message: string
}

type MyEventMap = {
    SystemEvent: [event: ISystemEvent]
}
const l = console.log
export default class SCEventLogFacade {
    private static child: ChildProcessWithoutNullStreams 
    private static rl: Readline.Interface
    public static events: EventEmitter<MyEventMap>

    public static init() {
        this.events = new EventEmitter<MyEventMap>()
        this.child = spawn('powershell.exe', [
            '-NoProfile',
            '-ExecutionPolicy', 'Bypass',
            '-NonInteractive',
            '-File', ` ${pr(scriptsPath, 'EventLogWatcher.ps1')}`
        ])
        this.child.stdout.setEncoding('utf8')
        this.rl = Readline.createInterface({
            input: this.child.stdout,
            terminal: false
        })
        this.rl.on('line', (line) => {
            if (!line.includes('GuborilCore')) return
            try {
                const obj = JSON.parse(line, (k, v) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v) ? new Date(v) : v) as ISystemEvent
                if (debug) {
                    l(data(`Handled System EventLog event: ${util.inspect(obj, { colors: true })}`))
                } else {
                    l(data(`Handled System EventLog event with id: ${obj.id}`))
                }
                this.events.emit('SystemEvent', obj)
            } catch (e: any) {
                console.warn(`Failed to handle event from System EventLog\n${bold('Line')}:${line}\n${bold('Stack')}:${e?.stack}`)
            }
        })
    }

    public static destructor() {
        this.child.kill()
        this.rl.close()
        this.events.removeAllListeners()
    }
}
