import { type ChangeEvent, cloneElement, useRef } from 'react'
import styles from './choicesBase.module.scss'
import Choices from 'choices.js'

type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface ChoicesBaseProps {
    disabled?: boolean
    onChange: (event: ChangeEvent<HTMLSelectElement>) => any
    children: React.ReactElement<HTMLOptionElement>[]
}

export default function ChoicesBase({ disabled, onChange, children }: ChoicesBaseProps) {
    const selectRef = useRef<HTMLSelectElement>(null)
    const UUIDref = useRef<UUID>(crypto.randomUUID())
    
    return <select
        disabled={disabled}
        key={UUIDref.current}
        ref={selectRef}
        name={UUIDref.current + '_name'}
        id={UUIDref.current + '_id'}
        onChange={onChange}
    >
        {children.map((el, idx) => {
            return cloneElement(el, {
                key: UUIDref.current + idx
            })
        })}
    </select>
}
