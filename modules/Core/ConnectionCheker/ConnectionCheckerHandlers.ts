import { ipcMain } from "electron";
import ConnectionChecker from "./ConnectionChecker.ts";
import { RegisterHandlersFor } from "../HandlersRegistrator.ts";

export default function initConnectionCheckerHandlers() {
    RegisterHandlersFor(ConnectionChecker, {
        ignoreKeys: ['init'],
        asyncKeys: ['calcExpiringTime', 'check', 'checkInternet', 'checkUrl']
    })

}