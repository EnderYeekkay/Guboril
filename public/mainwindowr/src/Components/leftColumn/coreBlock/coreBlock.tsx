import './CoreBlock.scss'
import Button , { ButtonStyle, ButtonIconSize }from '../../button/button.tsx'
import { useContext, useEffect, useRef } from 'react'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'

export default function CoreBlock() {
    const { settings, installStrategy } = useContext(ZapretContext)
    const ButtonUpdate = useRef<HTMLButtonElement>(null)
    const ButtonDelete = useRef<HTMLButtonElement>(null)
    

    useEffect(() => {
    },[])

    return <div className="container" id="core_block">
        <div id="core_block_top">
            <div id="core_block_text">ЯДРО</div>
            <div id="core_block_version_container">
                <div id="core_block_version_text">Версия</div>
                <div id="core_block_version_number">v72.9</div>
            </div>
        </div>
        <div id="core_block_bottom">
            <div id="core_block_controller">
                <Button
                    style={ButtonStyle.Primary}
                    label='Конфигурация'
                    Icon={{
                        iconSize: ButtonIconSize.i16,
                        iconPath: '../gear.png'
                    }}
                    btnRef={ButtonUpdate}
                    action={() => {}}
                    />
            </div>
            <Button
                style={ButtonStyle.Link}
                label='Открыть папку'
                action={core.openCoreFolder}
                Icon={{
                    iconPath: '../open_folder.png',
                    iconSize: ButtonIconSize.i18
                }}
            />
        </div>
    </div>
}
