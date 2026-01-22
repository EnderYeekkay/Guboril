import {  Ref,  useContext, useEffect, useRef, useState } from 'react'
import '../../../../global/styles/style.css'
import './button.scss'
import ZapretContext from '../../Contexts/Zapret/ZapretProvider.tsx'
import Dcloader from './dcloader/dcloader.tsx'
import { event } from 'jquery'

export enum ButtonStyle {
    Primary = 'btn_primary',
    Secondary = 'btn_secondary',
    Danger = 'btn_danger',
    Success = 'btn_success',
    Link = 'btn_link',
}

type ButtonProps = {
    style?: ButtonStyle
    Icon?: {
        iconPath?: string
        iconSize?: ButtonIconSize
    }
    disabled?: boolean
    label: string
    toStop?: boolean
    loading?: boolean
    action: (event?: React.MouseEvent<HTMLButtonElement>) => void
    btnRef?: Ref<HTMLButtonElement>
    addictionClasses?: string[]
}

export enum ButtonIconSize {
    i16 = 'btn_img16',
    i18 = 'btn_img18'
}

export default function Button(props: ButtonProps) {
    const { busy } = useContext(ZapretContext)
    const imgRef = useRef<HTMLImageElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<boolean>(Boolean(props.loading))

    useEffect(() => {
        if (!busy && loading && props.toStop) { // Если busy стал true, кнопка загружается, и она toStop
            setLoading(false) 
            if (imgRef.current) imgRef.current.style.opacity = '1'
            textRef.current.style.opacity = '1'
        }
    }, [busy])

    let btn_classes = [
        'btn',
        props.style || ButtonStyle.Secondary,
        props.toStop && busy && "to_stop",
        ...(props.addictionClasses ? props.addictionClasses : [])
    ].filter((value) => !!value)
    .join(' ');

    function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
        if (props.toStop) {
            setLoading(true)
            if (props.Icon) imgRef.current.style.opacity = '0'
            textRef.current.style.opacity = '0'
        }
        props.action(event)
    }

    const btnImg = <img ref={imgRef} src={props.Icon?.iconPath} className={props.Icon?.iconSize} alt=""/>
    return <button
        ref={props.btnRef}
        className={btn_classes}
        onClick={onClick}
        disabled={props.toStop && busy || props.disabled}
    >
        {props.Icon ? btnImg : ''}
        <div ref={textRef} className="btn_text">{props.label}</div>
        <Dcloader visible={loading}/>
    </button>
}