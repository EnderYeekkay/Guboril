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
import { NotifyProvider } from './Contexts/Notify/NotifyProvider.tsx';
import HighestError from './ErrorBoundaries/HighestError/HighestError.tsx';
const log = console.log
const root = ReactDOM.createRoot(document.getElementById('root'))

log('Yamete Kudasai');
(async () => {
    try {
        await Intialize()
        root.render(
            <React.StrictMode>
                <HighestError>
                        <NotifyProvider>
                    <ZapretProvider>
                            <Header/>
                            <App />
                    </ZapretProvider>
                        </NotifyProvider>
                </HighestError>
            </React.StrictMode>
        )
    } catch (e) {
        log(e.stack)
    } finally {
        mw.uwu()
    }
})()
