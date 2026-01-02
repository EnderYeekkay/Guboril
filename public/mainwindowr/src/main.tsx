import React from "react";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './mainwindow.scss'
import '../../global/styles/style.css'
import Header from "./Components/header/header.tsx";
const root = ReactDOM.createRoot(document.getElementById('root'))

console.log(mw)
root.render(
    <React.StrictMode>
        <Header/>
        <App/>
    </React.StrictMode>
)
mw.uwu()
