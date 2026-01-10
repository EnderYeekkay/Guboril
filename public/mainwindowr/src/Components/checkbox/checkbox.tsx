import { ChangeEvent, useContext, useRef } from 'react'
import './Checkbox.scss'
type CheckboxProps = {
    toStop?: boolean
    checked?: boolean | DataBooleanLike
    onChange: (event: ChangeEvent<HTMLInputElement>) => any
}
import ZapretContext, { resolveDataBooleanLike } from '../../Contexts/Zapret/ZapretProvider.tsx'
export default function Checkbox(props: CheckboxProps) {
    const { busy } = useContext(ZapretContext)
    const checkboxRef = useRef<HTMLInputElement>(null)

    return <input
        ref={checkboxRef}
        type="checkbox"
        className="toggle"
        disabled={props.toStop ? busy : false}
        onChange={props.onChange}
        checked={resolveDataBooleanLike(props.checked)}
    />
}
