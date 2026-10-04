import { ChangeEvent, useContext, useRef } from 'react'
import './Checkbox.scss'
type CheckboxProps = {
    checked?: boolean
    disabled?: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
}
import ZapretContext  from '../../Contexts/Zapret/ZapretProvider.tsx'
export default function Checkbox(props: CheckboxProps) {
    const { onChange, onClick, checked, disabled } = props
    const checkboxRef = useRef<HTMLInputElement>(null)

    return <input
        ref={checkboxRef}
        type="checkbox"
        className="toggle"
        disabled={disabled}
        onChange={(e) => onChange(e)}
        onClick={(e) => {onClick && onClick(e)}}
        checked={checked}
    />
}
