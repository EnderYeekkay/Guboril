import styles from './CheckConnectionBlock.module.scss'
import ConnectionChecker from './connectionChecker/connectionChecker.tsx'
import { useContext, useEffect, useRef, useState } from 'react'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'
import { type ConnectionCheckerResult } from '../../../../../../modules/Core/ConnectionChecker.ts'
import Button from '../../button/button.tsx'

export default function CheckConnectionBlock() {
    const { status, installStrategy, settings } = useContext(ZapretContext)
    const [ connection, setConnection ] = useState<ConnectionCheckerResult>(null)
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
            setChecking(false)
        }).catch(() => {
            if (cancelled || requestId !== requestIdRef.current) return
            setConnection(null)
            setChecking(false)
        })

        return () => {
            cancelled = true
        }
    }

    useEffect(checkConnection, [settings?.gameFilter, settings?.selectedStrategy, status])

    return <div className={`container ${styles.block}`}>
		  <ConnectionChecker {...{checking, statusRef, connection}}/>
          <Button label='Проверить' action={checkConnection} addictionClasses={[styles.check_btn]}/>
    </div>
}
