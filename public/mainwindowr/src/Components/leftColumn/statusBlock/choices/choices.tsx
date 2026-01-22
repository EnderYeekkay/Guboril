import { RefObject, useContext, useEffect, useRef } from 'react'
import './Choices.scss'
import ZapretProvider from '../../../../Contexts/Zapret/ZapretProvider.tsx'
import Choices from 'choices.js'

export type ChoicesSelectProps = {
    disabled?: boolean
}
export default function ChoicesSelect(props: ChoicesSelectProps) {
    const choicesRef = useRef<Choices.default>(null)
    const { busy, strategies, installStrategy, settings } = useContext(ZapretProvider)
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
            choicesRef.current.destroy()
            choicesRef.current = null
        }
    }, [settings, strategies])

    useEffect(() => {
        choicesRef.current.setChoiceByValue(String(settings.selectedStrategyNum))
    }, [settings])

    useEffect(() => {
        if (busy) choicesRef.current.disable()
        else choicesRef.current.enable()
    })
    
    return <select
        disabled={busy || props.disabled}
        ref={selectRef}
        name="strategy"
        id="strategy"
        onChange={(event) => installStrategy(event.target.value)}
    >
        {strategies.map((elem, i) => {
            return  <option
                key={i}
                value={i + 1}
            >
            {elem.includes('general.bat')
            ? elem.substring(0, elem.indexOf('.'))
            : elem.substring(elem.indexOf('(') + 1, elem.indexOf(')'))}
            </option>
        })}
    </select>
}
