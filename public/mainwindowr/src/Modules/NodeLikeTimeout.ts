export interface NodeLikeTimeoutOptions {
    delay?: number
    autostart?: boolean
    interval_drain?: (time: number) => void
    interval_time?: number
}
export default class NodeLikeTimeout {
    protected id: number

    protected interval_id: number
    protected interval_drain: (time: number) => void
    protected interval_time: number
    protected time_passed: number

    protected resolve: (reason: boolean) => void
    protected _delay: number
    protected _isActive: boolean
    get isActive() {
        return this.id !== null
    }
    public get delay() { return this._delay }
    public set delay(delay: number) {
        if (typeof delay !== 'number') throw new Error('Wrong delay type: ' + delay)
        
        this._delay = delay
        this.refresh()
    }
    protected readonly handler: () => void
    
    constructor (handler: () => void, {
        delay = 5_000,
        autostart = true,
        interval_drain,
        interval_time = 500
    }: NodeLikeTimeoutOptions) {
        if (typeof handler !== 'function') throw new Error('Wrong handler type: ' + handler)
        if (typeof delay !== 'number') throw new Error('Wrong delay type: ' + delay)

        this.time_passed = 0
        this.interval_time = interval_time
        if (interval_drain) this.interval_drain = () => {
            this.time_passed += interval_time
            interval_drain(this.time_passed)
        }
        this.handler = handler
        this._delay = delay
        this.id = null
        if (autostart) this.start()
    }

    start(): Promise<boolean> | undefined {
        const {id, delay} = this
        if (id !== null) {
            console.warn(`Timer with id: ${id} is already started!`)
            return 
        }
        return new Promise((res, rej) => {
            if (this.interval_drain) this.interval_id = window.setInterval(this.interval_drain, this.interval_time)
            this.resolve = res
            this.id = window.setTimeout(() => {
                try {
                    this.handler()
                    res(true)
                } catch(e) {
                    rej(e)
                } finally {
                    if (this.interval_drain) window.clearInterval(this.interval_id)
                    this.id = null
                }
            }, delay)
        })
    }
    stop() {
        if (this.id === null) {
            console.warn(`Timer with id: ${this.id} is already stopped!`)
            return
        }
        
        this.resolve(false)
        window.clearTimeout(this.id)
        this.id = null
        if (this.interval_drain) window.clearInterval(this.interval_id)
        this.time_passed = 0
    }
    refresh() {
        this.stop()
        return this.start()
    }
}