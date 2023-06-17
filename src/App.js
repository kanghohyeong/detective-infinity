import '@sakun/system.css'
import {useEffect, useState} from "react";
import {GAME_STATUS} from "./model/enums";
import Main from "./pages/Main";
import Loading from "./pages/Loading";
import Playing from "./pages/Playing";
import Ending from "./pages/Ending";

function App() {

    const [gameStatus, setGameStatus] = useState(GAME_STATUS.INIT);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            console.log = function no_console() {
            };
            console.warn = function no_console() {
            };
        }
    }, []);

    return (
        <div className="App">
            {gameStatus === GAME_STATUS.INIT && <Main setGameStatus={setGameStatus} setProgress={setProgress}/>}
            {gameStatus === GAME_STATUS.LOADING && <Loading progress={progress}/>}
            {gameStatus === GAME_STATUS.PLAYING && <Playing setGameStatus={setGameStatus}/>}
            {gameStatus === GAME_STATUS.FINISH && <Ending setGameStatus={setGameStatus}/>}
        </div>
    );
}

export default App;
