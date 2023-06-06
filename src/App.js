import './App.css';
import {useContext, useState} from "react";
import {GAME_STATUS} from "./model/enums";
import Main from "./pages/Main";
import Loading from "./pages/Loading";
import Playing from "./pages/Playing";
import {AIChatProvider} from "./context/AIChatContextProvider";
import {ApiKeyContext} from "./context/ApiKeyContextProvider";
import {ScenarioContext} from "./context/ScenarioContextProvider";
import Ending from "./pages/Ending";

function App() {

    const [gameStatus, setGameStatus] = useState(GAME_STATUS.INIT);
    const {apiKey} = useContext(ApiKeyContext);
    const {scenario} = useContext(ScenarioContext);

    return (
        <AIChatProvider apiKey={apiKey} baseScenario={scenario}>
            <div className="App">
                {gameStatus === GAME_STATUS.INIT && <Main setGameStatus={setGameStatus}/>}
                {gameStatus === GAME_STATUS.LOADING && <Loading/>}
                {gameStatus === GAME_STATUS.PLAYING && <Playing setGameStatus={setGameStatus}/>}
                {gameStatus === GAME_STATUS.FINISH && <Ending setGameStatus={setGameStatus}/>}
            </div>
        </AIChatProvider>
    );
}

export default App;
