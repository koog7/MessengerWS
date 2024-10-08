import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {persistor, store} from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import {Provider} from "react-redux";
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <PersistGate persistor={persistor}>
                <Provider store={store}>
                    <App />
                </Provider>
            </PersistGate>
        </BrowserRouter>
    </StrictMode>,
)
