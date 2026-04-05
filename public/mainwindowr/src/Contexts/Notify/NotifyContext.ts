import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { NotifyOptions, NotifyProps } from "./notify/notify.tsx";

export interface NotifyContextType {
    sendNotify: (props: NotifyProps) => void
    archivedNotifies: NotifyOptions[]
    setArchivedNotifies: Dispatch<SetStateAction<NotifyOptions[]>>
    setVisibilityOfList: Dispatch<SetStateAction<boolean>>
    visibilityOfList: boolean
    visibilityOfListBtn: RefObject<HTMLDivElement>
}

const NotifyContext = createContext<NotifyContextType | null>(null)
export default NotifyContext as React.Context<NotifyContextType>
