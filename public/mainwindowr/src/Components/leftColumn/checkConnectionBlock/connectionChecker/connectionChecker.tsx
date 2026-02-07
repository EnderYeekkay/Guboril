import { useContext, useEffect, useRef, useState } from 'react'
import './ConnectionChecker.scss'
import ZapretContext from '../../../../Contexts/Zapret/ZapretProvider.tsx'
import Dcloader from '../../../button/dcloader/dcloader.tsx'
import { type ConnectionCheckerResult } from '../../../../../../../modules/Core/ConnectionChecker.ts'

export default function ConnectionChecker() {
    const { status, installStrategy, settings } = useContext(ZapretContext)
    const [ connection, setConnection ] = useState<ConnectionCheckerResult>(null)
    const [ checking, setChecking ] = useState<boolean>(false)
    const statusRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setChecking(true)
        core.connectionChecker().then((res) => {
            setConnection(res)
            setChecking(false)
        })
    }, [settings?.gameFilter, settings?.selectedStrategy, status])

    return <div id="connection_checker_container">
        <div id="connection_checker_text">Соединение</div>
        <div id="connection_checker_status" ref={statusRef}>
            {checking 
            ? <Dcloader visible={true}/>
            : getConnectionStatus(connection)
        }
        </div>
    </div>
}

function getConnectionStatus(status: ConnectionCheckerResult) {
    if (!status) return 'Нет интернета'

    const { passes, successfulPasses } = status
    if (passes === successfulPasses) return 'ОК'
    if (successfulPasses < passes && successfulPasses > 0) return 'Нестабильно'
    if (successfulPasses === 0) return 'Нет'
}
