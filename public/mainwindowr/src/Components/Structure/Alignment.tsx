import styles from "./Alignment.module.css"

export function Column({children}: {children: React.ReactNode}){
    return <div className={styles.column}>
        {children}
    </div>
}

export function Row({children}: {children: React.ReactNode}){
    return <div className={styles.row}>
        {children}
    </div>
}

export type LayoutProps = {
    fullWidth?: boolean,
    fullHeight?: boolean,
    direction?: 'row' | 'column',
    children: React.ReactNode;
}

export function Layout({ fullWidth, fullHeight, direction, children }: LayoutProps) {
    return <div className={`${fullWidth ? styles.fullWidth : ''} ${fullHeight ? styles.fullHeight : ''}`}>
        {direction === 'row' ? <Row>{children}</Row> : <Column>{children}</Column>}
    </div>
}