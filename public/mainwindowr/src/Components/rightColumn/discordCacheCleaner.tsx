import { useContext, useState } from "react";
import Button, { ButtonStyle } from "../button/button.tsx";
import NotifyContext from "../../Contexts/Notify/NotifyProvider.tsx";
import { NotifyStyle } from "../../Contexts/Notify/notify/notify.tsx";
export default function DiscordCacheCleaner() {
    const { sendNotify } = useContext(NotifyContext)
    const [loading, setLoading] = useState<boolean>(false)

    async function action() {
        setLoading(true)
        const res = await mw.clear_discord_cache()
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
