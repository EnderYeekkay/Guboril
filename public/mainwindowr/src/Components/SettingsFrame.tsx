import { useContext } from "react";
import Button from "./button/button.tsx";
import { FrameContext } from "../Contexts/FrameContext.tsx";
import { Column } from "./Structure/Alignment.tsx";

export default function SettingsFrame() {
    const frameContext = useContext(FrameContext);
    return (
        <>
            <Column>
                <p>Settings</p>
                <Button label="Назад" action={() => frameContext.setFrame('home')} />
            </Column>
        </>
    )
}