import './Modules/logger.ts'
import React from "react";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './mainwindow.scss'
import '../../global/styles/style.css'
import "./weblibs/Choices/choices.min.css"
import Header from "./Components/header/header.tsx";
import { ZapretProvider } from "./Contexts/Zapret/ZapretProvider.tsx";
import { NotifyProvider } from './Contexts/Notify/NotifyProvider.tsx';
import HighestError from './ErrorBoundaries/HighestError/HighestError.tsx';
import Modal from './Contexts/Modal/modal/modal.tsx'
import Button, { ButtonStyle } from './Components/button/button.tsx';
import ModalProvider from './Contexts/Modal/ModalProvider.tsx';
const log = console.log
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

log('Yamete Kudasai');
(async () => {
    try {
        root.render(
            <React.StrictMode>
                {/* <HighestError> */}
                        <ModalProvider>
                            <NotifyProvider>
                                <ZapretProvider>
                                    <Header/>
                                    <App />
                                </ZapretProvider>
                            </NotifyProvider>
                        </ModalProvider>
                {/* </HighestError> */}
            </React.StrictMode>
        )
    } catch (e: any) {
        log(e.stack)
    } finally {
        mw.uwu()
    }
})()
