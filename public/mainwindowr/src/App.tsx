import React, { useContext } from "react";
import Button from "./Components/button/button.tsx";
import LeftColumn from "./Components/leftColumn/leftColumn.tsx";
import RightColumn from "./Components/rightColumn/rightColumn.tsx";
import Configuration from "./Components/configuration/configuration.tsx";
export default function App() {
    return <div id="app">
        {/* <Configuration/> */}
        <LeftColumn/>
        <RightColumn/>
    </div>
}
