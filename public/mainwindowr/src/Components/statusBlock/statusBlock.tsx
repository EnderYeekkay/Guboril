import './StatusBlock.scss'
import Button, { ButtonIconSize, ButtonStyle } from '../button/button.tsx'
import { useEffect, useRef } from 'react'
export default function StatusBlock() {
    const selectRef = useRef<HTMLSelectElement>(null)
    useEffect(() => {
        if (!selectRef.current) return
        //@ts-ignore
        const choices = new Choices(selectRef.current, {
            searchEnabled: true,
            itemSelectText: '',
            position: "bottom",
            searchPlaceholderValue: "Введите название",
        })
    })
    return <div className="container" id="status_block">
        <div className="">Сервис</div>
        <div id="service_status">Отключен</div>
        <Button
            label=''
            style={ButtonStyle.Danger}
            Icon={{iconPath: '../power.png', iconSize: ButtonIconSize.i18}}
        />
        <label htmlFor="strategy" id="strategy_label">Выбор стратегии</label>
        <select name="strategy" id="strategy"></select>
</div>
}
