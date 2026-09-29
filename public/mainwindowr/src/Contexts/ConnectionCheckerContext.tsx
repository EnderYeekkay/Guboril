import { createContext, ReactNode, useState } from "react";

import type { ConnectionStatus } from "../../../../modules/Core/ConnectionCheker/ConnectionChecker.ts";
export interface ConnectionCheckerType {
    status?: ConnectionStatus[]
    isChecking: boolean
    check: () => void
}
export const ConnectionCheckerContext = createContext<ConnectionCheckerType>(null!)

export function ConnectionCheckerProvider({children}: ContextProps): ReactNode {
    const [status, setStatus] = useState<ConnectionStatus[]>()
    const [isChecking, setIsChecking] = useState<boolean>(true)
    const check = () => {
        
    }
    return (
        <ConnectionCheckerContext.Provider value={{
            status,
            isChecking,
        }}>
            { children }
        </ConnectionCheckerContext.Provider>
    )
}