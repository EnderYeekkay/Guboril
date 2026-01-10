import './Dcloader.scss'

export default function Dcloader({visible}) {
    if (!visible) return null
    return <div className="dc_loader">
        <span></span>
        <span></span>
        <span></span>
    </div>
}
