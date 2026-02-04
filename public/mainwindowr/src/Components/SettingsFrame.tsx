import { useContext } from "react";
import Button from "./button/button.tsx";
import { FrameContext } from "./FrameContext.tsx";

export default function SettingsFrame() {
    const frameContext = useContext(FrameContext);
    return (
        <>
            <p>Settings</p>
            <Button label="Назад" action={() => frameContext.setFrame('home')} />
        </>
    )
}