import { VList } from 'virtua';
import styles from './SubcontainerVirt.module.scss';

interface SubcontainerProps {
    items: string[];
    addictionClasses?: string[];
}

export default function SubcontainerVirt({ items, addictionClasses }: SubcontainerProps) {
    return (
        <div className={`container ${styles.block} ${addictionClasses?.join(' ')}`}>
            <VList 
                style={{ height: '100%', width: '100%' }} 
                className={styles.virtualList}
            >
                {items.map((ip, index) => (
                    <div key={index} className={styles.ipRow}>
                        {ip}
                    </div>
                ))}
            </VList>
        </div>
    );
}
