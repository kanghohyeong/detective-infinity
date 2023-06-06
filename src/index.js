import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApiKeyProvider} from "./context/ApiKeyContextProvider";
import {ScenarioProvider} from "./context/ScenarioContextProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ApiKeyProvider>
            <ScenarioProvider>
                <App/>
            </ScenarioProvider>
        </ApiKeyProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
