import { useContext } from 'react';
import { VList } from 'virtua';

import styles from './SubcontainerVirt.module.scss';
import NotifyContext from '../../Contexts/Notify/NotifyContext.ts';
import { NotifyStyle } from '../../Contexts/Notify/notify/notify.tsx';

interface SubcontainerProps{
    items: string[];
    addictionClasses?: string[];
    onDelete?: (value: string) => void
}

export default function SubcontainerVirt({
    items,
    addictionClasses,
    onDelete
}: SubcontainerProps) {
    const { sendNotify } = useContext(NotifyContext)
    return (
        <div className={`container ${styles.block} ${addictionClasses?.join(' ')}`}>
            <VList 
                style={{ height: '100%', width: '100%' }} 
                className={styles.virtualList}
                data={items}
            >
                {(ip, index) => (
                    <div
                        key={index}
                        className={styles.ipRow}
                        title={ip}    
                    >
                        <div className={styles.content}>{ip}</div>
                        <div
                            className={styles.copyButton}
                            onClick={() => {
                                navigator.clipboard.writeText(ip)
                                sendNotify({
                                    title: 'Скопировано!',
                                    description: ip,
                                    expiring: true,
                                    style: NotifyStyle.Important
                                })
                            }}
                            >      
                            <svg 
                                width="12" 
                                height="12" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </div>
                        <div
                            className={styles.deleteButton}
                            onClick={() => {
                                onDelete && onDelete(ip)
                            }}
                            >
                            ✕
                        </div>
                    </div>
                )}
            </VList>
        </div>
    );
}
