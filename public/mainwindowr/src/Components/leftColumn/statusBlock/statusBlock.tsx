import './StatusBlock.scss'
import { useContext, useEffect, useRef, useState } from 'react'

import Button, { ButtonIconSize, ButtonStyle } from '../../button/button.tsx'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'
import ChoicesSelect from './choices/choices.tsx'

export default function StatusBlock() {
    const { strategies, status, installStrategy, remove, settings, busy } = useContext(ZapretContext)
    
    return (
        <div className="container" id="status_block">
            <div className="">Сервис</div>
            <div id="service_status">{status ? "Работает" : "Отключён"}</div>
            <Button
                label={status ? 'Отключить' : 'Запустить'}
                style={status ? ButtonStyle.Danger : ButtonStyle.Success}
                Icon={{iconPath: '../power.png', iconSize: ButtonIconSize.i18}}
                action={() => status ? remove() : installStrategy(settings.selectedStrategyNum)}
                toStop={true}
            />
            <label htmlFor="strategy" id="strategy_label">Выбор стратегии</label>
            <ChoicesSelect/>
        </div>
    )
}
