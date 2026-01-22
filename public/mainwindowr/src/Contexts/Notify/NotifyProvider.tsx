import { createContext, useEffect, useState } from "react";
import Notify, { NotifyOptions, NotifyProps } from "./notify/notify.tsx";
const NotifyContext = createContext<{sendNotify: (props: NotifyProps) => void}>(null) 
export default NotifyContext

export function NotifyProvider({ children }: ContextProps) {
    const [notifyProps, setNotifyProps] = useState<NotifyProps>(null)
    const sendNotify = (props: NotifyOptions) => {
        setNotifyProps({...props, id: Date.now()})
    }
    const clearNotify = () => setNotifyProps(null)
    return <NotifyContext.Provider value={{ sendNotify }}>
        {children}
        {notifyProps &&
            <Notify {...{...notifyProps, clearNotify}} key={notifyProps.id}/>
        }
    </NotifyContext.Provider>
}