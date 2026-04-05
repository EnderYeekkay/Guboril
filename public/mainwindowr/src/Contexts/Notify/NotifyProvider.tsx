import { createContext, Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import Notify, { NotifyOptions, NotifyProps } from "./notify/notify.tsx";
import NotifiesList from "../../Components/header/notifiesList/notifiesList.tsx";
export interface NotifyContextType {
    sendNotify: (props: NotifyProps) => void

    archivedNotifies: NotifyOptions[]
    setArchivedNotifies: Dispatch<SetStateAction<NotifyOptions[]>>

    setVisibilityOfList: Dispatch<SetStateAction<boolean>>
    visibilityOfList: boolean
    visibilityOfListBtn: RefObject<HTMLDivElement>
}
import NotifyContext from "./NotifyContext.ts";
export function NotifyProvider({ children }: ContextProps) {
    const [notifyProps, setNotifyProps] = useState<NotifyProps | null>(null)
    const [archivedNotifies, setArchivedNotifies] = useState<NotifyOptions[]>([])
    const [visibilityOfList, setVisibilityOfList] = useState<boolean>(false)
    const visibilityOfListBtn = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>
    const notifiesListRef = useRef<HTMLDivElement>(null)

    const sendNotify = (props: NotifyOptions, silent = false) => {
        const newNotifyProps = {...props, id: Date.now()}
        if (!silent) setNotifyProps(newNotifyProps)
        let newArchivedNotifies = [...archivedNotifies, newNotifyProps]
        if (newArchivedNotifies.length > 30) newArchivedNotifies.shift()
        setArchivedNotifies(newArchivedNotifies)

    }
    const clearNotify = () => setNotifyProps(null)

    useEffect(() => {
        if (!visibilityOfList) return

        const controller = new AbortController()
        const onDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node | null
            if (!target) return

            if (notifiesListRef.current?.contains(target)) return
            if (visibilityOfListBtn.current?.contains(target)) return

            setVisibilityOfList(false)
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setVisibilityOfList(false)
        }
        document.addEventListener('click', onDocumentClick, {signal: controller.signal})
        document.addEventListener('keydown', onKeyDown, {signal: controller.signal})
        return () => {
            controller.abort()
        }
    }, [visibilityOfList])
    
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

        archivedNotifies,
        setArchivedNotifies,

        setVisibilityOfList,
        visibilityOfList,
        visibilityOfListBtn
    }}>
        {children}
        {notifyProps &&
            <Notify {...{...notifyProps, clearNotify}} key={notifyProps.id}/>
        }
        {visibilityOfList && 
            <NotifiesList listRef={notifiesListRef as RefObject<HTMLDivElement>}/>
        }
    </NotifyContext.Provider>
}
