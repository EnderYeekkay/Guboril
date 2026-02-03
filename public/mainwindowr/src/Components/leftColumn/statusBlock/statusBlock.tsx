import './StatusBlock.scss'
import { useContext, useEffect } from 'react'

import Button, { ButtonIconSize, ButtonStyle } from '../../button/button.tsx'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'
import ChoicesSelect from './choices/choices.tsx'

export default function StatusBlock() {
    const { status, installStrategy, settings } = useContext(ZapretContext)
    console.log(settings)
    return (
        <div className="container" id="status_block">
            <div className="">Сервис</div>
            <div id="service_status">{status ? "Работает" : "Отключён"}</div>
            <Button
                label={status ? 'Отключить' : 'Запустить'}
                style={status ? ButtonStyle.Danger : ButtonStyle.Success}
                Icon={{iconPath: '../power.png', iconSize: ButtonIconSize.i18}}
                action={() => installStrategy(status ? null : settings.selectedStrategy)}
                toStop={true}
            />
            <label htmlFor="strategy" id="strategy_label">Выбор стратегии</label>
            <ChoicesSelect/>
        </div>
    )
}
