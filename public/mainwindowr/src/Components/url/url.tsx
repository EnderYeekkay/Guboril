import styles from './url.module.scss'
export interface UrlProps {
    href: string
    label?: string
    addictionClasses?: string[]
}
export default function Url({ href, label, addictionClasses }: UrlProps) {
    return <div
        className={`${styles.url} ${addictionClasses && addictionClasses.join(' ')}`}
        onClick={() => mw.externalUrl(href)}
    >
        {label || href}
    </div>
}
