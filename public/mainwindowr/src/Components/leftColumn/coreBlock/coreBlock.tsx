import './CoreBlock.scss'
import Button , { ButtonStyle, ButtonIconSize }from '../../button/button.tsx'
import { useContext, useEffect, useRef } from 'react'
import ZapretContext from '../../../Contexts/Zapret/ZapretProvider.tsx'

export default function CoreBlock() {
    const { isInstalled, settings, remove, update, coreUninstall, } = useContext(ZapretContext)
    const ButtonUpdate = useRef<HTMLButtonElement>(null)
    const ButtonDelete = useRef<HTMLButtonElement>(null)
    const ButtonInstall = useRef<HTMLButtonElement>(null)
    

    useEffect(() => {
        ButtonUpdate.current.style.width="calc(50% - 5px)"
        ButtonDelete.current.style.width="calc(50% - 5px)"
        ButtonInstall.current.style.width="100%"
    },[])
    useEffect(() => {
        if (isInstalled) {
            ButtonUpdate.current.style.display = "flex"
            ButtonDelete.current.style.display = "flex"
            ButtonInstall.current.style.display = "none"
        } else {
            ButtonUpdate.current.style.display = "none"
            ButtonDelete.current.style.display = "none"
            ButtonInstall.current.style.display = "flex"
        }
    })
    const ButtonUpdateAction = async () => {
        await update()
    }
    const ButtonDeleteAction = async () => {
        await coreUninstall()
    }
    const ButtonInstallAction = async () => {
        await update()
    }

    return <div className="container" id="core_block">
        <div id="core_block_top">
            <div id="core_block_text">ЯДРО</div>
            <div id="core_block_version_container">

                <div id="core_block_version_text">{isInstalled ? "Версия" : "Не установлено"}</div>
                <div id="core_block_version_number">{isInstalled ? `v${settings.zapretVersion}` : ''} </div>
            </div>
        </div>
        <div id="core_block_bottom">
            <div id="core_block_controller">
                <Button
                    style={ButtonStyle.Primary}
                    label='Обновить'
                    btnRef={ButtonUpdate}
                    action={ButtonUpdateAction}
                    toStop={true}
                    />
                <Button
                    style={ButtonStyle.Danger}
                    label='Удалить'
                    btnRef={ButtonDelete}
                    action={ButtonDeleteAction}
                    toStop={true}
                    />
                <Button
                    style={ButtonStyle.Primary}
                    label='Установить'
                    btnRef={ButtonInstall}
                    action={ButtonInstallAction}
                    toStop={true}
                />
            </div>
            <Button
                style={ButtonStyle.Link}
                label='Открыть папку'
                action={zapret.openCoreFolder}
                Icon={{
                    iconPath: '../open_folder.png',
                    iconSize: ButtonIconSize.i18
                }}
            />
        </div>
    </div>
}
