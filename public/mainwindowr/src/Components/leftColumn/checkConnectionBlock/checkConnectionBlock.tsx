import styles from './CheckConnectionBlock.module.scss'
import ConnectionChecker from './connectionChecker/connectionChecker.tsx'
import { useContext, useEffect, useRef, useState } from 'react'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'
import { type ConnectionCheckerResult } from '../../../../../../modules/Core/ConnectionChecker.ts'
import Button, { ButtonIconSize } from '../../button/button.tsx'
import ConnectionCheckerImage from './connectionCheckerImage/connectionCheckerImage.tsx'

export default function CheckConnectionBlock() {
    const { status, installStrategy, settings } = useContext(ZapretContext)
    const [ connection, setConnection ] = useState<ConnectionCheckerResult>(null)
    const [ stringConnectionStatus, setStringConnectionStatus] = useState<StringConnectionStatus>('Нет интернета')
    const [ checking, setChecking ] = useState<boolean>(false)

    const statusRef = useRef<HTMLDivElement>(null)
    const requestIdRef = useRef(0)

    function checkConnection() {
        let cancelled = false
        const requestId = ++requestIdRef.current
        setChecking(true)
        core.connectionChecker().then((res) => {
            if (cancelled || requestId !== requestIdRef.current) return
            
            setConnection(res)
            setStringConnectionStatus(getConnectionStatus(res))
            setChecking(false)
        }).catch(() => {
            if (cancelled || requestId !== requestIdRef.current) return
            setConnection(null)
            setStringConnectionStatus(getConnectionStatus(null))
            setChecking(false)
        })

        return () => {
            cancelled = true
        }
    }

    useEffect(checkConnection, [status, settings?.selectedStrategy])

    return <div className={`container ${styles.block}`}>
        <ConnectionCheckerImage
            stringConnectionStatus={stringConnectionStatus}
            hidden={checking}
        />
        <div className={styles.text_subblock}>
            <ConnectionChecker 
                checking={checking}
                connection={connection}
                statusRef={statusRef}
                stringConnectionStatus={stringConnectionStatus}
            />
            <Button
                label='Проверить'
                action={checkConnection}
                addictionClasses={[styles.check_btn]}
                Icon={{
                    iconSize: ButtonIconSize.i16,
                    iconPath: '../refresh.png'
                }}
            />
        </div>
    </div>
}

export type StringConnectionStatus = "Нет интернета" | "ОК" | "Нестабильно" | "Нет"
function getConnectionStatus(status: ConnectionCheckerResult): StringConnectionStatus {
    if (!status) return 'Нет интернета'

    const { passes, successfulPasses } = status
    if (passes === successfulPasses) return 'ОК'
    if (successfulPasses < passes && successfulPasses > 0) return 'Нестабильно'
    if (successfulPasses === 0) return 'Нет'
}
