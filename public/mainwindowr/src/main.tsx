import './Modules/logger.ts'
import React from "react";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './mainwindow.scss'
import '../../global/styles/style.css'
import "./weblibs/Choices/choices.min.css"
import Header from "./Components/header/header.tsx";
import { Intialize } from "./Contexts/Zapret/initialCondition.ts";
import { ZapretProvider } from "./Contexts/Zapret/ZapretProvider.tsx";

const log = console.log
const root = ReactDOM.createRoot(document.getElementById('root'))
async function renderer() {
    await Intialize()
    root.render(
        <React.StrictMode>
            <ZapretProvider>
                <Header/>
                <App />
            </ZapretProvider>
        </React.StrictMode>
    )
    mw.uwu()
}
renderer()