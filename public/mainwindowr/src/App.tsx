import React, { useContext, useState } from "react";
import Button from "./Components/button/button.tsx";
import LeftColumn from "./Components/leftColumn/leftColumn.tsx";
import RightColumn from "./Components/rightColumn/rightColumn.tsx";
import SettingsFrame from "./Components/SettingsFrame.tsx";
import { FrameContext, FrameProvider } from "./Contexts/FrameContext.tsx";
export default function App() {
    return <div id="app">
        <FrameProvider>
            <MainFrame />
        </FrameProvider>
    </div>
}

function MainFrame() {
    const frameContext = useContext(FrameContext);

    return (
        <>
            {frameContext.frame === 'home' && <HomeFrame />}
            {frameContext.frame === 'settings' && <SettingsFrame />}
        </>
    )
}

function HomeFrame() {
    return (
        <>
            <LeftColumn />
            <RightColumn />
        </>
    )
}

