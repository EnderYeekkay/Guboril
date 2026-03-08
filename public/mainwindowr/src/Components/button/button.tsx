import { isValidElement, JSX, Ref, useEffect, useRef, useState } from 'react'
import '../../../../global/styles/style.css'
import './button.scss'
import Dcloader from './dcloader/dcloader.tsx'

export enum ButtonStyle {
    Primary = 'btn_primary',
    Secondary = 'btn_secondary',
    Danger = 'btn_danger',
    SilentDanger = 'btn_silent_danger',
    Success = 'btn_success',
    Link = 'btn_link',
    TabSelector = 'btn_tab_selector',
}

type ButtonProps = {
    style?: ButtonStyle
    Icon?: {
        iconPath: string
        iconSize: ButtonIconSize
        addictionClasses?: string[]
    } | JSX.Element
    disabled?: boolean
    label?: string | React.ReactNode
    loading?: boolean
    action: (event?: React.MouseEvent<HTMLButtonElement>) => void
    btnRef?: Ref<HTMLButtonElement>
    addictionClasses?: string[]
    autoFocus?: boolean
    tooltip?: string
}

export enum ButtonIconSize {
    i16 = 'btn_img16',
    i18 = 'btn_img18'
}

export interface CButton extends JSX.Element {}
export default function Button(props: ButtonProps): CButton {
    const imgRef = useRef<HTMLImageElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<boolean>(Boolean(props.loading))

    let btn_classes = [
        'btn',
        props.style || ButtonStyle.Secondary,
        ...(props.addictionClasses ? props.addictionClasses : [])
    ].filter((value) => !!value)
    .join(' ');

    function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
        props.action(event)
    }

    let btnImg: JSX.Element = null
    if (props.Icon && ('iconPath' in props.Icon) && ('iconSize' in props.Icon) ) {
        btnImg = <img
            ref={imgRef}
            src={props.Icon?.iconPath}
            className={`${props.Icon?.iconSize} ${props.Icon?.addictionClasses?.join(' ')}`}
            alt=""
            />
    } else if (isValidElement(props.Icon)) {
        btnImg = props.Icon
    }

    return <button
        ref={props.btnRef}
        className={btn_classes}
        onClick={onClick}
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        title={props.tooltip}
    >
        {btnImg}
        <div className="btn_text_container">
            <div ref={textRef} className="btn_text">{props.label}</div>
        </div>
        <Dcloader visible={loading}/>
    </button>
}