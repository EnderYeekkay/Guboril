import { RefObject, useContext, useEffect, useRef } from 'react'
import './Choices.scss'
import ZapretProvider from '../../../../Contexts/Zapret/ZapretProvider.tsx'
import Choices from 'choices.js'

export type ChoicesSelectProps = {
    disabled?: boolean
}
export default function ChoicesSelect(props: ChoicesSelectProps) {
    const choicesRef = useRef<Choices.default>(null)
    const { strategies, strategy, installStrategy, settings } = useContext(ZapretProvider)

    const lastStrategyInoRef = useRef<number>(strategy?.ino)
    const selectRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        let choicesOptions: Partial<Choices.Options> = {
            shouldSort: false,
            searchEnabled: true,
            itemSelectText: '',
            position: "bottom",
            searchPlaceholderValue: "Введите название",
        }
        //@ts-ignore
        choicesRef.current = new Choices(selectRef.current, choicesOptions) as Choices.default
        return () => {
            choicesRef.current!.destroy()
            choicesRef.current = null
        }
    }, [strategies])

    useEffect(() => {
        const newStrategy = strategy
        if (newStrategy?.ino === lastStrategyInoRef.current) {
            choicesRef.current?.setChoiceByValue(newStrategy?.ino?.toString())
        } else {
            lastStrategyInoRef.current = newStrategy?.ino
        }
    }, [strategy])

    
    return <select
        disabled={props.disabled}
        ref={selectRef}
        name="strategy"
        id="strategy"
        onChange={(event) => installStrategy(parseInt(event.target.value))}
    >
        {strategies.map((elem, i) => {
            return  <option
                key={i}
                value={elem.ino}
            >
            {elem.shortName}
            </option>
        })}
    </select>
}
