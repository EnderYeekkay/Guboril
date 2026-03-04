import { useContext, useState } from "react";
import Button, { ButtonStyle } from "../button/button.tsx";
import NotifyContext from "../../Contexts/Notify/NotifyContext.ts";
import { NotifyStyle } from "../../Contexts/Notify/notify/notify.tsx";
import ModalContext from "../../Contexts/Modal/ModalContext.ts";
export default function DiscordCacheCleaner() {
    const { sendModal } = useContext(ModalContext)
    const { sendNotify } = useContext(NotifyContext)
    const [loading, setLoading] = useState<boolean>(false)

    async function action() {
        console.log('Cleaning Discord Cache...')
        const UAC = await sendModal({
            title: 'Очистить кэш Discord?',
            description: 'Для этого придётся закрыть Discord. После очистки он будет загружаться немного дольше. Вы уверены?',

            submitText: 'Очистить',
            submitStyle: ButtonStyle.Danger,

            cancelText: 'Отменить',
            cancelStyle: ButtonStyle.Secondary
        })
        if (!UAC) return

        setLoading(true)
        const res = await mw.clear_discord_cache()
        console.log(res)
        sendNotify({
            title: res ? 'Выполнено' : 'Не выполнено',
            style: res ? NotifyStyle.Success : NotifyStyle.Error,
            expiring: true,
            description: res ? 'Кэш Discord был успешно очищен!' : 'Кэш Discord не был очищен. Вероятно, у вас не установлен Discord или возникла ошибка.'
        })
        setLoading(false)
    }

    return <Button
        label="Очистить"
        style={ButtonStyle.Secondary}
        addictionClasses={['btn_settings']}
        loading={loading}
        action={action}
    />
}
