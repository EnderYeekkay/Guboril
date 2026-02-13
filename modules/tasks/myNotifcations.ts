import { app, Notification } from 'electron/main';
import Core from '../Core/Core.ts';
function isNotificationsAllowed() {
    return Core.settings.notifications
}
export function sendServiceOnNotify(strategy: string) {
    if (!isNotificationsAllowed()) return
    new Notification({ title: `Сервис (${strategy}) включён!`, silent: true}).show()
}
export function sendServiceOffNotify() {
    if (!isNotificationsAllowed()) return
    new Notification({ title: 'Сервис отключён!', silent: true}).show()
}

export function sendUENotify(err: Error) {
    if (!isNotificationsAllowed()) return
    new Notification({title: 'Uncaught Exception', silent: false, body: err.stack}).show()
}

export function sendURNotify(err: Error) {
    if (!isNotificationsAllowed()) return
    new Notification({title: 'Unhandled Rejection', silent: false, body: err.stack}).show()
}