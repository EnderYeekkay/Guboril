import { Component } from 'react'
import '../../../../global/styles/style.css'
import './button.scss'

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
    label: string
    toStop?: boolean
}

export enum ButtonIconSize {
    i16 = 'btn_img16',
    i18 = 'btn_img18'
}

export default class Button extends Component {
    declare props: ButtonProps
    render () {
        let btn_classes = `btn ${this.props.style || ''}`
        return <button className={btn_classes}>
            <img src={this.props.Icon.iconPath} className={this.props.Icon.iconSize} alt=""/>
            <div className="btn_text">{this.props.label}</div>
        </button>
    }
}