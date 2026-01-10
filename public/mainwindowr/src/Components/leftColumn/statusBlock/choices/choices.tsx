import { RefObject, useContext, useEffect, useRef } from 'react'
import './Choices.scss'
import ZapretProvider from '../../../../Contexts/Zapret/ZapretProvider.tsx'
import Choices from 'choices.js'

export default function ChoicesSelect() {
    const choicesRef = useRef<Choices.default>(null)
    const { busy, strategies, installStrategy, settings } = useContext(ZapretProvider)
    const selectRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        let choicesOptions: Partial<Choices.Options> = {
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
    }, [settings])

    useEffect(() => {
        choicesRef.current.setChoiceByValue(String(settings.selectedStrategyNum))
    }, [settings])

    useEffect(() => {
        if (busy) choicesRef.current.disable()
        else choicesRef.current.enable()
    })

    function generateStrategyList() {
        let res = []
        for (let i = 0; i <= strategies.length; i++) {
            res.push(
            <option
                key={i}
                value={i + 1}
            >
            {i+1}. {strategies[i]}
            </option>)
        }
        return res
    }
    
    return <select
        disabled={busy}
        ref={selectRef}
        name="strategy"
        id="strategy"
        onChange={(event) => installStrategy(event.target.value)}
    >
        {generateStrategyList()}
    </select>
}
