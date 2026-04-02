import { type ChangeEvent, cloneElement, RefObject, useEffect, useRef } from 'react'
import styles from './choicesBase.module.scss'
import Choices, { type ClassNames } from 'choices.js'

type UUID = `${string}-${string}-${string}-${string}-${string}`

interface StrictChangeEvent<T extends string = string> extends ChangeEvent<HTMLSelectElement> {
  target: HTMLSelectElement & {
    value: T;
  };
}
export interface ChoicesBaseProps<T extends string = string> {
    disabled?: boolean
    onChange: (event: StrictChangeEvent<T>) => any
    choicesOptions?: Partial<Omit<Choices.Options, 'classNames'>>
    choicesClasses?: Partial<Choices.ClassNames>
    children: React.ReactElement<HTMLOptionElement>[]

    selectRef?: RefObject<HTMLSelectElement>
    choicesRef?: RefObject<Choices.default>
}

export default function ChoicesBase<T extends string = string>({ disabled, onChange, choicesOptions, choicesClasses , children }: ChoicesBaseProps<T>) {
    const selectRef = useRef<HTMLSelectElement>(null)
    const choicesRef = useRef<Choices.default>(null)
    const UUIDRef = useRef<UUID>(crypto.randomUUID())

    // Привязка Choices к состоянию React
    useEffect(() => {
        let updatedChoicesClasses = styles as unknown as ClassNames
        for (let style in updatedChoicesClasses) {
            if (choicesClasses && Object.hasOwn(choicesClasses, style)) {
                updatedChoicesClasses[style] = updatedChoicesClasses[style] + ' ' + choicesClasses[style]
            }
        }
        const updatedChoicesOptions = {
            shouldSort: false,
            itemSelectText: '',
            position: "bottom",
            ...choicesOptions,
            classNames: updatedChoicesClasses
        } 
        //@ts-ignore
        choicesRef.current = new Choices(selectRef.current, updatedChoicesOptions) as Choices.default
        return () => {
            choicesRef.current!.destroy()
            choicesRef.current = null
        }
    }, [choicesOptions, children])

    return <select
        disabled={disabled}
        key={UUIDRef.current}
        ref={selectRef}
        name={UUIDRef.current + '_name'}
        id={UUIDRef.current + '_id'}
        onChange={onChange}
    >
        {children?.map((el, idx) => {
            return cloneElement(el, {
                key: UUIDRef.current + idx
            })
        })}
    </select>
}
