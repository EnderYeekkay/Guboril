import './StatusBlock.scss'
import { useContext, useEffect, useRef, useState } from 'react'

import Button, { ButtonIconSize, ButtonStyle } from '../../button/button.tsx'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'
import ChoicesSelect from './choices/choices.tsx'

export default function StatusBlock() {
    const { status, installStrategy, settings } = useContext(ZapretContext)
    return (
        <div className="container" id="status_block">
            <div className="">Сервис</div>
            <div id="service_status">{status ? "Работает" : "Отключён"}</div>
            <Button
                label={status ? 'Отключить' : 'Запустить'}
                style={status ? ButtonStyle.SilentDanger : ButtonStyle.Success}
                Icon={!status ? {iconPath: '../power.png', iconSize: ButtonIconSize.i18} : null}
                action={() => installStrategy(status ? null : settings.selectedStrategy)}
            />
            <label htmlFor="strategy" id="strategy_label">Выбор стратегии</label>
            <ChoicesSelect/>
        </div>
    )
}
