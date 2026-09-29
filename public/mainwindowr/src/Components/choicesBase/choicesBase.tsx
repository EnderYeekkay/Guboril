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
        const updatedChoicesClasses = { ...styles } as Record<string, string | string[]>;

        if (choicesClasses) {
            for (const key in choicesClasses) {
                if (Object.hasOwn(choicesClasses, key)) {
                    const baseClass = styles[key]
                    const customClass = choicesClasses[key as unknown as keyof ClassNames] as string
                    updatedChoicesClasses[key] = [baseClass, customClass].flat().filter(Boolean)
                }
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
    })

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
