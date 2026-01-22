import { MouseEventHandler, ReactNode, useContext, useEffect, useRef } from 'react'
import './Notify.scss'
import { event } from 'jquery'
import Button, { ButtonStyle } from '../../../Components/button/button.tsx'
import NodeLikeTimeout from '../../../Modules/NodeLikeTimeout.ts'

export const enum NotifyStyle {
    Success   = "notify_success",
    Warning   = "notify_warning",
    Error     = "notify_danger",
    Secondary = "notify_secondary",
    Important = "notify_primary"
}

export const NotifyThumbnailUrl = {
    [NotifyStyle.Success]:   '../Success.png' ,
    [NotifyStyle.Warning]:   '../Warning.png',
    [NotifyStyle.Error]:     '../Error.png',
    [NotifyStyle.Secondary]: '../Secondary.png',
    [NotifyStyle.Important]: '../Important.png'
} as const satisfies Record<NotifyStyle, string> 

export type NotifyActionRow = [ReactNode?, ReactNode?, ReactNode?, ReactNode?]
export interface NotifyOptions {
    title:        string
    style?:       NotifyStyle
    description?: string
    stack?:       string
    expiring?:    boolean
    actionRow?:   NotifyActionRow
}
export interface NotifyProps extends NotifyOptions{
    id?:          number
    clearNotify?:  () => void
}

const expiring_time = 5_000

export default function Notify({ id, title,
    clearNotify,
    style = NotifyStyle.Secondary,
    description = '',
    stack = null,
    expiring = false,
    actionRow = [],
}: NotifyProps) {
    if (!id) throw new Error('ID didn\'t find in props!')
    if (actionRow.length > 4) console.warn(`Length of action row ${actionRow.length} is too much!`)
    
    const classes = `notify_container container ${style}`
    const timeoutRef = useRef<NodeLikeTimeout>(null)
    const notifyRef = useRef<HTMLDivElement>(null)
    const progressBar = useRef<HTMLDivElement>(null)
    const delayedRemoveNotify = (time: number = 0) => {
        notifyRef.current.classList.add('is-closing')
        setTimeout(() => clearNotify(), time)
    }

    const escBindRemoveNotifyEffect = () => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                delayedRemoveNotify(400)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => {
            window.removeEventListener('keydown', handleEsc)
        }
    }
    
    const manageCurrentProgress = (time: number) => {
        progressBar.current.style.width = `${time / expiring_time * 110}%`
    }

    const onMouseEnterHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (expiring) {
            progressBar.current.style.display = 'none'
            progressBar.current.style.width = '0'
            timeoutRef.current.stop()
        }
    }
    const onMouseLeaveHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (expiring) {
            progressBar.current.style.display = 'block'
            timeoutRef.current.start()
        }
    }
    const expireEffect = () => {
        if (expiring) {
            timeoutRef.current = new NodeLikeTimeout(clearNotify, {
                delay: expiring_time,
                interval_drain: manageCurrentProgress
            })
            return () => {
                if (timeoutRef.current.isActive) timeoutRef.current.stop()
            }
        }
    }
    useEffect(escBindRemoveNotifyEffect, [])
    useEffect(expireEffect, [id])
    return <div
        className={classes}
        ref={notifyRef}
        onClick={() => { delayedRemoveNotify(400) }}
        onDrag={() => { delayedRemoveNotify(400) }}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
    >
        <div className="notify_text_container">
            <div className="notify_title">{capitalize(title)}</div>
            <div className="notify_description" hidden={description.length == 0}>{capitalize(description)}</div>
            <div className="notify_action_row">
                {actionRow}
            </div> 
        </div>
        {expiring && <div className={`notify_expiring_bar ${style}`} ref={progressBar}/>}
        <img className="notify_thumbnail" src={NotifyThumbnailUrl[style]}/>
        <img className="notify_close" src='../close.png' onClick={() => delayedRemoveNotify()}/>
    </div>
}

/**
 * hello -> Hello
 */
const capitalize = (str: string) => {
    if (str?.length > 0) return str[0].toUpperCase() + str.substring(1)
    else return str
}
