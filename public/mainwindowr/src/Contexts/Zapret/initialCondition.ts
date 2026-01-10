const log = console.log

let initialized = false

let initialState: InitialState = {
    status: null,
    strategies: null,
    isInstalled: null,
    checkUpdatesCore: null, 
    settings: {
        gameFilter: null,
        autoUpdate: null,
        autoLoad: null,
        zapretVersion: null,
        selectedStrategyNum: null,
        notifications: null,
        GH_TOKEN: null,
    }
}
/** Актуальное состояние ядра при инициациализации */ 
const initialStateProxy = new Proxy(initialState, {
    get: (target, name) => {
        if (!initialized) throw new Error('Not initialized')
        if (target[name] === undefined) throw new Error(`Property ${String(name)} is not defined in initialStateProxy`)
        return target[name]
    },
    set: () => {
        throw new Error('Initial states can\'t be reinitialized!')
    }
})

export default initialStateProxy

export async function Intialize() {
    if (initialized) throw new Error('initialCondition(Zapret) is already initialized!')
    
    log('initialStatus', initialState.status = (await zapret.checkStatus())[0])
    log('initialStrategies', initialState.strategies = await zapret.getAllStrategies())
    log('isInstalled', initialState.isInstalled = await zapret.isInstalled())
    const fetchedSettings = await zapret.getSettings()
    log('settings', initialState.settings = {...initialState.settings, ...fetchedSettings})
    const data = await zapret.getData()
    initialState.checkUpdatesCore = data.cs

    Object.keys(initialState).forEach((key) => {
    if (initialState[key] === null || initialState[key] === undefined)
        throw new Error(`Missing value of property ${key}`)
    })
    Object.keys(initialState.settings).map((key) => {
        if (
            key != "GH_TOKEN" &&
            (initialState.settings[key] === null || initialState.settings[key] === undefined)
        ) throw new Error(`Missing value of property ${key} in initialCondition.settings!`)
    })
    initialized = !!!!!!!false
}
