import { Ref } from 'react'
import './ConnectionChecker.scss'
import Dcloader from '../../../button/dcloader/dcloader.tsx'
import { type ConnectionCheckerResult } from '../../../../../../../modules/Core/ConnectionChecker.ts'
import { StringConnectionStatus } from '../checkConnectionBlock.tsx'

interface ConnectionCheckerProps {
    statusRef: Ref<HTMLDivElement>
    connection: ConnectionCheckerResult
    checking: boolean
    stringConnectionStatus: StringConnectionStatus
}

export default function ConnectionChecker(props: ConnectionCheckerProps) {
    const { statusRef, connection, checking, stringConnectionStatus } = props

    return <div id="connection_checker_container">
        <div id="connection_checker_text">Соединение</div>
        <div id="connection_checker_status" ref={statusRef}>
            {checking 
            ? <Dcloader visible={true}/>
            : stringConnectionStatus
            }   
        </div>
        {/* <div id="connection_checker_status" ref={statusRef}>
            <Dcloader visible={true}/>
        </div> */}
    </div>
}