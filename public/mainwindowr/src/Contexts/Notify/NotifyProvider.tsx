import { createContext, Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import Notify, { NotifyOptions, NotifyProps } from "./notify/notify.tsx";
import NotifiesList from "./notifiesList/notifiesList.tsx";
export interface NotifyContextType {
    sendNotify: (props: NotifyProps) => void
    setVisibilityOfList: Dispatch<SetStateAction<boolean>>
    visibilityOfList: boolean
    visibilityOfListBtn: RefObject<HTMLDivElement>
}
const NotifyContext = createContext<NotifyContextType>(null) 
export default NotifyContext

export function NotifyProvider({ children }: ContextProps) {
    const [notifyProps, setNotifyProps] = useState<NotifyProps>(null)
    const [notifies, setNotifies] = useState<NotifyOptions[]>([])
    const [visibilityOfList, setVisibilityOfList] = useState<boolean>(false)
    const visibilityOfListBtn = useRef<HTMLDivElement>(null)

    const sendNotify = (props: NotifyOptions, silent = false) => {
        const NotifyProps = {...props, id: Date.now()}
        if (!silent) setNotifyProps(notifyProps)
        setNotifies([...notifies, NotifyProps])
    }
    const clearNotify = () => setNotifyProps(null)

    useEffect(() => {
        if (!visibilityOfListBtn.current?.style) return
        
        if (visibilityOfList) {
            visibilityOfListBtn.current.style.opacity = '1'
        } else {
            visibilityOfListBtn.current.style.opacity = '.8'
        }
    }, [visibilityOfList])

    return <NotifyContext.Provider value={{ 
        sendNotify,
        setVisibilityOfList,
        visibilityOfList,
        visibilityOfListBtn
    }}>
        {children}
        {notifyProps &&
            <Notify {...{...notifyProps, clearNotify}} key={notifyProps.id}/>
        }
        {visibilityOfList && 
            <NotifiesList/>
        }
    </NotifyContext.Provider>
}