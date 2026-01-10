// Лог
const origLog = console.log.bind(console)
console.log = (...args) => {
    logger.log('renderer-log', ...args)
    origLog(...args)
}

// Предупреждение
const origWarn = console.warn.bind(console)
console.warn = (...args) => {
    logger.warn('renderer-log', ...args)
    origWarn(...args)
}

// Ошибка
const origError = console.error.bind(console)
console.error = (...args) => {
    logger.error('renderer-log', ...args)
    origError(...args)
}
const l = console.log