import React from "react";
import Button from "./Components/button/button.tsx";
import LeftColumn from "./Components/leftColumn/leftColumn.tsx";
import RightColumn from "./Components/rightColumn/rightColumn.tsx";

export default function App() {
    return <div id="app">
        <LeftColumn/>
        <RightColumn/>
    </div>
}