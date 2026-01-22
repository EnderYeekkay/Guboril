import { ChangeEvent, useContext, useRef } from 'react'
import './Checkbox.scss'
type CheckboxProps = {
    toStop?: boolean
    checked?: boolean | DataBooleanLike
    disabled?: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
}
import ZapretContext, { resolveDataBooleanLike } from '../../Contexts/Zapret/ZapretProvider.tsx'
export default function Checkbox(props: CheckboxProps) {
    const { busy } = useContext(ZapretContext)
    const checkboxRef = useRef<HTMLInputElement>(null)

    return <input
        ref={checkboxRef}
        type="checkbox"
        className="toggle"
        disabled={props.disabled || props.toStop ? busy : false}
        onChange={(e) => props.onChange(e)}
        onClick={props.onClick ? (e) => props.onClick(e) : () => {}}
        checked={resolveDataBooleanLike(props.checked)}
    />
}
