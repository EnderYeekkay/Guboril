import { useContext, useEffect, useRef, useState } from 'react'
import './ConnectionChecker.scss'
import ZapretContext from '../../../../Contexts/Zapret/ZapretProvider.tsx'

export default function ConnectionChecker() {
    const [ connection, setConnection ] = useState<boolean|null>(null)
    const { status, installStrategy, settings } = useContext(ZapretContext)
    const statusRef = useRef<HTMLDivElement>(null)
    function getConnectionStatus(status: boolean) {
        switch (status) {
            case true:
                return 'OK'
                break
            case false:
                return 'UNSTABLE'
                break
            case null:
                return 'FAILED'
                break
        }
    }
    useEffect(() => {
        statusRef.current.innerHTML = 'Проверяем...'
        core.connectionChecker().then((res) => {
            setConnection(res)
            statusRef.current.innerHTML = getConnectionStatus(res)
        })
    }, [settings?.gameFilter, settings?.selectedStrategy, status])
    return <div id="connection_checker_container">
        <div id="connection_checker_text">Статус</div>
        <div id="connection_checker_status" ref={statusRef}>Проверяем...</div>
    </div>
}
