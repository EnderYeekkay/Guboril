import { Ref } from 'react'
import './ConnectionChecker.scss'
import Dcloader from '../../../button/dcloader/dcloader.tsx'
import { type ConnectionCheckerResult } from '../../../../../../../modules/Core/ConnectionChecker.ts'

interface ConnectionCheckerProps {
    statusRef: Ref<HTMLDivElement>
    connection: ConnectionCheckerResult
    checking: boolean
}

export default function ConnectionChecker(props: ConnectionCheckerProps) {
    const { statusRef, connection, checking } = props

    return <div id="connection_checker_container">
        <div id="connection_checker_text">Соединение</div>
        <div id="connection_checker_status" ref={statusRef}>
            {checking 
            ? <Dcloader visible={true}/>
            : getConnectionStatus(connection)
            }   
        </div>
        {/* <div id="connection_checker_status" ref={statusRef}>
            <Dcloader visible={true}/>
        </div> */}
    </div>
}

function getConnectionStatus(status: ConnectionCheckerResult) {
    if (!status) return 'Нет интернета'

    const { passes, successfulPasses } = status
    if (passes === successfulPasses) return 'ОК'
    if (successfulPasses < passes && successfulPasses > 0) return 'Нестабильно'
    if (successfulPasses === 0) return 'Нет'
}
