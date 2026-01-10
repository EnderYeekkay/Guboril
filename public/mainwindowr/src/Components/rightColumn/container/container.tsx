import './Container.scss'

type ContainerProps = {
    children: React.ReactNode
    text: string
}
export default function Container({ children, text }:ContainerProps) {
    return <div className="container">
        <div className="base_setting_text">{text}</div>
        {children}
    </div>
}
