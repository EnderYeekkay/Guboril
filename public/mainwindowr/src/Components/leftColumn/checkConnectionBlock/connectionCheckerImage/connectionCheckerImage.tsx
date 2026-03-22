import styles from './connectionCheckerImage.module.scss'
import { type ConnectionCheckerResult } from '../../../../../../../modules/Core/сonnectionChecker.ts'

import good from './assets/good.svg'
import unstable from './assets/unstable.svg'
import bad from './assets/bad.svg'
import no_internet from './assets/no_internet.svg'
import { StringConnectionStatus } from '../checkConnectionBlock.tsx'
import { useEffect, useRef } from 'react'

export interface ConnectionCheckerImage {
    stringConnectionStatus: StringConnectionStatus
    hidden: boolean
}

export default function ConnectionCheckerImage(props: ConnectionCheckerImage) {
    let src: string = null
    const { stringConnectionStatus, hidden } = props
    const imgRef = useRef<HTMLImageElement>(null)
    
    useEffect(() => {
        imgRef.current.style.opacity = hidden ? '0' : '1'
    }, [hidden])

    switch (stringConnectionStatus) {
        case 'ОК':
            src = good
            break
        case 'Нестабильно':
            src = unstable
            break
        case 'Нет':
            src = bad
            break
        case 'Нет интернета':
            src = no_internet
            break
        default:
            throw new Error(`Wrong value of stringConnectionStatus given! value: ${stringConnectionStatus}`)
    }
    return <img ref={imgRef} src={src} className={styles.image}/>
}
