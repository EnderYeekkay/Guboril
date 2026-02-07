import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import Notify, { NotifyOptions, NotifyProps } from "./notify/notify.tsx";
import NotifiesList from "./notifiesList/notifiesList.tsx";
export interface NotifyContextType {
    sendNotify: (props: NotifyProps) => void
}
const NotifyContext = createContext<NotifyContextType>(null) 
export default NotifyContext

export function NotifyProvider({ children }: ContextProps) {
    const [notifyProps, setNotifyProps] = useState<NotifyProps>(null)
    const [notifies, setNotifies] = useState<NotifyOptions[]>([])
    const sendNotify = (props: NotifyOptions, silent = false) => {
        const NotifyProps = {...props, id: Date.now()}
        if (!silent) setNotifyProps(notifyProps)
        setNotifies([...notifies, NotifyProps])
    }
    const clearNotify = () => setNotifyProps(null)
    
    return <NotifyContext.Provider value={{ 
        sendNotify
    }}>
        {children}
        {notifyProps &&
            <Notify {...{...notifyProps, clearNotify}} key={notifyProps.id}/>
        }
        {NotifiesList()}
    </NotifyContext.Provider>
}