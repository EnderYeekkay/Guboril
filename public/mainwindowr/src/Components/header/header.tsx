import './header.scss'
import Collapse from './collapse.tsx'
import Close from './close.tsx'

export default function Header() {
    return <header>
        <img id="logo" src="../icon.ico"/>
        <div id="maintext">Губорыл {mw.version}</div>
        <div id="header_btns">
            <Collapse/>
            <Close/>
        </div>
    </header>
}
    