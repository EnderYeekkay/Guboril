import { useState } from "react";
import Button, { ButtonStyle } from "../button/button.tsx";
export default function DiscordCacheCleaner() {
    const [loading, setLoading] = useState<boolean>(false)

    async function action() {
        setLoading(true)
        const res = await mw.clear_discord_cache()
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