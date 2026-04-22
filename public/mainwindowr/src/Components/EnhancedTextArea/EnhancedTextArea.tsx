import { RefObject, useEffect, useRef, useState } from 'react'
import styles from './EnhancedTextArea.module.scss'
interface IEnhancedTextAreaProps {
    addictionClasses?: string[]
    validator?: (value: string) => boolean
    valid?: boolean
    setValid?: (value: boolean) => void
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    attrs?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}
export default function EnhancedTextArea({
    addictionClasses,
    validator,
    valid,
    setValid,
    onChange,
    attrs,
}: IEnhancedTextAreaProps) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [validLocal, setValidLocal] = useState<boolean>(true)
    // if (!(!!validator === !!valid === !!setValid)) throw new Error('validator and validRef must be used in the format all or nothing!')
    useEffect(() => {
        setValid && setValid(validLocal)
    },[validLocal])
    return <textarea
        ref={textAreaRef}
        className={`${styles.block} ${!validLocal && styles.invalid} ${addictionClasses?.join(' ')}`}
        autoFocus={true}
        minLength={1}
        onChange={(event) => {
            if (validator && setValid) {
                const rows = event.target.value.split('\n')
                setValidLocal(rows.every(validator))
            }
            onChange && onChange(event)
        }}
        {...attrs}
    >
		
    </textarea>
}
